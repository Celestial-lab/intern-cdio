import axios from "../../axios";


export const getInforById = async (userid) => {
  try {
    const response = await axios.get(`/api/info/${userid}`);
    return response.data;
    
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    return null;
  } 
}

export const addCreateInfor = async (formData) => {
  try {
    const response = await axios.post(`/api/createInfo`, formData);
    return response.data;
  }
  catch (error) {
    console.log('lỗi ở hàm thêm rồi: ', error);
    return null;
  }
}

export const editInforById = async (inforId, data) => {
  try {
    const response = await axios.put(`/api/updateInfo/${inforId}`, data);
    return response.data;
  }
  catch (error) {
    console.error('loi o edit profile roi dan oi', error);
    return null;
  }
}

export const addRegisterAuction = async (userId, auctionId) => {
  try {
    const response = await axios.post(`/api/registerUser/`, {userId, auctionId})
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

export const deleteRegisterAuction = async (auctionId) => {
  try {
    const response = await axios.delete(`/api/deletregister/${auctionId}`);
    return response.data;
  }
  catch (error) {
    console.error('lỗi ở hàm delete rồi đan le ơi: ', error);
    return null;
  }
}

export const checkAllowance = async (spender, owner) => {
  try {
    const response = await axios.post(`/api/allowance`, {spender, owner});
    return response.data
  } catch (error) {
    console.error('lỗi ở hàm delete rồi đan le ơi: ', error);
    return null;
  }
}