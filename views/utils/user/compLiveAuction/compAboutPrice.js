
import { putBid, getAuctionById, endAuctionById, getCurrentPrice } from "@/views/services/AuctionServices";
import AuctionABI from "../../../store/abiBid.json";
import { ethers } from 'ethers';

// lấy thông tin cuộc đấu giá để hiển thị ra giao diện LiveAuction
export const getInforAuction = async (auctionIdLive, setAuctionData) => {
    if (auctionIdLive) {
      const response = await getAuctionById(auctionIdLive);
      if (response) {
        const auctionDataAfterGet = [{
          name: response.productName,
          timeRemaining: response.endTime,
          description: response.description,
          startingPrice: parseFloat(response.startingPrice),
          imageUrl: response.imageUrl,
          id: response.auctionId,
          active: response.active,
          startTime: response.startTime,
        }];
        setAuctionData(auctionDataAfterGet)
      }
    }
};

// lấy giá tiền
export const getCurrentPriceFrom2 = async (auctionIdLive, setCurrentPrice) => {
    if (auctionIdLive) {
      const response = await getCurrentPrice(auctionIdLive);
      console.log('response from getCurrentPriceFrom2: ', response);
      if (response.status === 404) {
        const response = await getAuctionById(auctionIdLive);
        const startingPrice = parseFloat(response.startingPrice);
        console.log('startingPrice: ', startingPrice);
        setCurrentPrice(startingPrice)
      } else if (response) {
        const currentPriceFromResponse = response.totalAmountAndStartingPrice;
        console.log('currentPriceFromResponse: ', currentPriceFromResponse);
        setCurrentPrice(currentPriceFromResponse);
      }
    }
};

// xử lí khi kết thúc đấu giá
export const endedAuction = async (auctionIdLive) => {
  if (!auctionIdLive) {
    console.log("auctionIdLive không hợp lệ.");
    return;
  }

  try {
    const response = await endAuctionById(auctionIdLive);
    console.log("response trả về khi kết thúc đấu giá:", response);

    // if (response.errorCode === 0) {
    //   console.log("Đã kết thúc đấu giá thành công.");
    // } else if (response.errorCode === 5) {

    //   const errorMessage = response.error || "";
    //   const errorRegex = /(?:reason|message)="([^"]+)"|code=(-?\d+)/g;

    //   const matches = [...errorMessage.matchAll(errorRegex)];
    //   const extractedInfo = matches.reduce((acc, match) => {
    //     if (match[1]) acc.message = match[1]; // Lấy message nếu có
    //     if (match[2]) acc.code = match[2];   // Lấy code nếu có
    //     return acc;
    //   }, {});

      // console.log("Thông tin lỗi trích xuất:", extractedInfo);

      // Xử lý lỗi theo từng trường hợp cụ thể
      // if (extractedInfo.message === "Auction already ended") {
      //   console.warn("Cuộc đấu giá đã kết thúc trước đó.");
      // } else if (extractedInfo.message === "already known") {
      //   console.warn("Giao dịch đã tồn tại. Không cần thực hiện thêm.");
      // } else if (extractedInfo.code === "-32000") {
      //   console.error("Lỗi Ethereum: Không thể xử lý yêu cầu.");
      // } else {
      //   console.error("Lỗi không xác định:", extractedInfo);
      // }
    

  } catch (error) {
    console.error("Lỗi mạng hoặc server:", error);
  }
};
