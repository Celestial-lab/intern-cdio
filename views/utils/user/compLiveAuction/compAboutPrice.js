
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

  const response = await endAuctionById(auctionIdLive);
  console.log("response trả về khi kết thúc đấu giá:", response);

  if (response.errorCode === 0) {
    console.log("Đã kết thúc đấu giá thành công, có thể gọi hàm get result");
  } else if (response.errorCode === 5) {
    console.log("Bị lỗi khi kết thúc đấu giá.");
  }

  // Trả về kết quả, bất kể thành công hay lỗi
  return response;
};