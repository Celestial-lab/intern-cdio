import axios from "../axios";

//hàm gọi api trả về thông tin tất cả các cuộc đấu giá
export const getAuction = async() => {
    try {
        const response = await axios.get('/api/auction/status');
        console.log('data trả về của api lấy các cuộc đấu giá: ', response.data);
        return response.data;
    } catch (error) {
        console.error('fetch data fail', error);
        throw error;
    }
}

//hàm gọi api trả về thông tin của cuộc đấu giá theo auctionId
export const getAuctionById = async(id) => {
    try {
        const response = await axios.get(`/api/auctions/${id}`);
        // console.log('data trả về của api lấy thông tin đấu giá theo id: ', response.data);
        return response.data;
    } catch (error) {
        console.error('fetch data fail', error);
        throw error;
    }
}

//hàm gọi api trả về thông tin số tiền cao nhất hiện tại
export const getHighestPrice = async(auctionId) => {
    try {
        const response = await axios.get(`/api/auctions/${auctionId}/current-highest-bidder`);
        return response.data;
    } catch (error) {
        console.error('lấy giá tiền cao nhất thất bại: ', error);
        throw error;
    }
}

//hàm gọi api đặt giá theo auctionId, bidAmount, inforId
export const putBid = async(auctionId, bidAmount, inforId) => {
    try {
        const response = await axios.post(`/api/bid`, {auctionId, bidAmount, inforId});
        return response.data;
    } catch (error) {
        console.error('đặt giá thất bại: ', error);
        throw error;
    }
}
