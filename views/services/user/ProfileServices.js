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
    console.log('Dữ liệu gửi đi:', data); // Thêm dòng này để kiểm tra dữ liệu
    const response = await axios.put(`/api/profileuser/${id}`, data);
    console.log('Dữ liệu trả về:', response.data);
    return response.data;
  }
  catch (error) {
    console.error('loi o edit profile roi dan oi', error);
    return null;
  }
}