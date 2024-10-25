import axios from "../../axios";

export const getProfileByEmail = async (email) => {
  try {
    const response = await axios.get(`/api/profileuser/${email}`);
    return response.data;
    
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  } 
}

export const editProfileById = async (id, data) => {
  try {
    const response = await axios.put(`/api/profileuser/${id}`, data);
    return response.data;
  }
  catch (error) {
    console.error('loi o edit profile roi dan oi', error);
    return null;
  }
}

export const addRegisterAuction = async (userId, auctionId) => {
  try {
    const response = await axios.post(`/api/register/`, {userId, auctionId})
    return response.data;
  }
  catch (error) {
    console.error('lỗi ở hàm thêm sản phẩm đăng kí đấu giá', error);
    return null;
  }
}

export const getRegisterAuction = async (userId) => {
  try {
    const response = await axios.get(`/api/${userId}/auctions`);
    return response.data;
  }
  catch (error) {
    console.error('lỗi ở hàm get register rồi đan le ơi: ', error);
    return null;
  }
}

export const Approve = async (spender, amount) => {
  try {
    const response = await axios.post(`/api/approve`, {spender, amount});
    return response.data;
  }
  catch (error) {
    console.error('lỗi ở hàm Approve rồi đan le ơi: ', error);
    return null;
  }
}