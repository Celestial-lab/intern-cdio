import axios, {instanceFormData} from '../../axios'; 

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

export const handleAddProduct = async (formData) => {
    try {
      const response = await instanceFormData.post('/api/products', formData);
      console.log('data lấy được của hàm handleAddProduct:', response.data);
      return response;
    } catch (error) {
      console.error('lỗi bên author services nè:', error.response);
      return null;
    }
  };
  
export const getProductByEmail = async (email) => {
    try {
        const response = await axios.get(`/api/products/${email}`); 
        console.log('data lấy dược hàm getProductByEmail', response.data)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        return [];
    }
};

export const getImageByFile = async (filename) => {
    try {
        const response = await axios.get(`/api/images/${filename}`); 
        console.log('data lấy dược', response.data)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product data:', error);
        return [];
    }
}