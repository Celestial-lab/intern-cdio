import axios from '../../axios';

export const getProfileByEmail = async (email) => {
    try{
        const response = await axios.get(`/api/profileauthor/${email}`);
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch profile data: ', error);
        return null;
    }
}

export const editProfileById = async (id, data) => {
    try {
        console.log('data gửi', data);
        const response = await axios.put(`/api/profileauthor/${id}`, data);
        
        console.log('data nhận', response.data);
        return response.data;
    }
    catch (error) {
      console.error('loi o edit profile author roi dan oi', error);
      return null;
    }
  }