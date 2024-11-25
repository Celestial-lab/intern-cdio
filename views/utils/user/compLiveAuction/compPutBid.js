import { putBid, getAuctionById, getAmountBidByBidder, getCurrentPrice } from "@/views/services/AuctionServices";
import AuctionABI from "../../../store/abiBid.json";
import { ethers } from 'ethers';


const contractAddress = process.env.NEXT_PUBLIC_Contract_Auction;

//hàm lấy dữ liệu bid và xuất dữ liệu ra sau khi convert
export const fetchData = async (auctionIdLive, setFilteredBids) => {
  const data = await getAmountBidByUser();
  console.log('data: ', data);
  if (data && data.bids) { // Kiểm tra dữ liệu có tồn tại và bids là mảng
    if (auctionIdLive) {
      // Lọc danh sách các bid theo auctionIdLive
      const filteredData = data.bids.filter(bid => bid.auctionId === Number(auctionIdLive));
      console.log('filteredData: ', filteredData);
      const sortedBids = filteredData.sort((a, b) => b.bidAmount - a.bidAmount);  // Hoặc dùng thời gian nếu có
      setFilteredBids(sortedBids);
    }
  }
};

// hàm lấy danh sách đặt giá của user ở tất cả các cuộc đấu giá
const getAmountBidByUser = async () => {
  const bidderId = localStorage.getItem('inforId');
  try {
    const response = await getAmountBidByBidder(bidderId);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đặt giá:", error);
    return null;
  }
}

//hàm xử lí đặt giá
export const handlePutBid = async (auctionIdLive, bidMount, inforId) => {
  try {
    // Đầu tiên, thực hiện đặt giá trong smart contract
    const transactionReceipt = await handlePutBidToBlockchain(auctionIdLive, bidMount);
    console.log('Giao dịch blockchain thành công:', transactionReceipt);

    // Sau đó, cập nhật giá trong cơ sở dữ liệu
    const databaseResponse = await handlePutBidToDatabase(auctionIdLive, bidMount, inforId);
    console.log('Đặt giá thành công:', databaseResponse);

  } catch (error) {
    console.error('Đặt giá thất bại:', error);
    throw error;
  }
}

const handlePutBidToBlockchain = async (auctionId, bidMount) => {
    try {
      // Chuyển đổi bidMount thành đơn vị phù hợp với hợp đồng thông minh (tính theo wei hoặc các đơn vị tương đương)
      const amountInUnits = ethers.parseUnits(bidMount.toString(), 18);
  
      // Yêu cầu tài khoản của người dùng
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      // Khởi tạo đối tượng contract
      const auctionContract = new ethers.Contract(contractAddress, AuctionABI, signer);
      const gasPrice = ethers.parseUnits("2000", "gwei");
      // console.log('gasprice: ', gasPrice);
  
      // Gửi giao dịch bid
      const tx = await auctionContract.bid(auctionId, amountInUnits, {gasPrice: gasPrice});
      
      console.log("Đang thực hiện đặt giá...");
      
      // Chờ giao dịch hoàn thành và lấy receipt
      const receipt = await tx.wait();
      console.log("Đặt giá thành công:", receipt);
  
      return receipt;
    } catch (error) {
      console.error('Lỗi khi thực hiện giao dịch với smart contract:', error);
      throw error;
    }
  }

const handlePutBidToDatabase = async (auctionIdLive, bidMount, inforId) => {
  try {
    // Gửi yêu cầu đặt giá vào cơ sở dữ liệu (giả sử bạn đã có dịch vụ API này)
    const response = await putBid(auctionIdLive, bidMount, inforId);
    console.log("Cập nhật giá đấu thầu vào cơ sở dữ liệu thành công:", response);
    return response;
  } catch (error) {
    console.error('Lỗi khi cập nhật giá vào cơ sở dữ liệu:', error);
    throw error;
  }
}


const getAuctionDetails = async (auctionId) => {
  try {
    // Yêu cầu tài khoản MetaMask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Khởi tạo đối tượng contract
    const auctionContract = new ethers.Contract(contractAddress, AuctionABI, signer);

    // Gọi hàm `auctions` với auctionId để lấy thông tin cuộc đấu giá
    const auctionDetails = await auctionContract.auctions(auctionId);

    // Kiểm tra và in ra các chi tiết của cuộc đấu giá
    console.log('Thông tin cuộc đấu giá:', auctionDetails);
    
    // Kiểm tra trạng thái của cuộc đấu giá
    if (!auctionDetails.active) {
      console.log("Cuộc đấu giá đã kết thúc hoặc không hoạt động.");
    } else {
      console.log("Cuộc đấu giá đang hoạt động.");
    }

    return auctionDetails;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cuộc đấu giá:", error);
    throw error;
  }
};
