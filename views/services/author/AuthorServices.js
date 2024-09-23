
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

export const handleAddProduct = async (id, productname, description, price, status, image, createdAt, updatedAt) => {
    try {
      const response = await axios.post('/api/products', {
        id,
        productname,
        description,
        price,
        status,
        image,
        createdAt,
        updatedAt,
      });
      return response;
    } catch (error) {
      console.error('Add Product API error:', error.response || error.message);
      return null;
    }
  };

export const getProductByEmail = async (email) => {
    try {
        const response = await axios.get(`/api/products/${email}`); 
        console.log('data lấy dược', response.data)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        return [];
    }
};

export const getImageByEmail = async (email) => {
    try {
        const response = await axios.get(`/api/images/email/${email}`); 
        console.log('data lấy dược', response.data)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        return [];
    }
}
