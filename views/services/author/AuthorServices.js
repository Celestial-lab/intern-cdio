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
      const response = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
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

export const deleteProductById = async (id) => {
    try {
        const response = await axios.delete(`/api/products/${id}`);

        console.log('loi o ham delete ne dan oi, in response ra ri ne: ', response.data);

        return response.data;
    } catch (error) {
        console.error('hết cứu, k xoá được ní ơi, hàm lỗi', error);
        return ơ
    }
}