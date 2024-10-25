import axios from "../axios";

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

export const getAuctionById = async(id) => {
    try {
        const response = await axios.get(`/api/auction/${id}`);
        console.log('data trả về của api lấy thông tin đấu giá theo id: ', response.data);
        return response.data;
    } catch (error) {
        console.error('fetch data fail', error);
        throw error;
    }
}
