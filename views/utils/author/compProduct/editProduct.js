'use client'

import { editProductById } from '@/views/services/author/AuthorServices';
import { message } from 'antd';

export const handleEditProduct = async(formData, id, editingProduct, setProducts) => {
    
    const authorId = localStorage.getItem('authorId');

    if (!authorId) {
      message.error('Author ID not found. Please add information.');
      return;
    }

    const formDataUpdated = new FormData();
    formDataUpdated.append('loginId', authorId);
    formDataUpdated.append('productname', formData.productname);
    formDataUpdated.append('description', formData.description);
    formDataUpdated.append('startingPrice', formData.price);
    formDataUpdated.append('durationInMinutes', formData.auctionTime);
    formDataUpdated.append('startTime', formData.startTime.toISOString());
    if  (formData.image && formData.image[0] && formData.image[0].originFileObj) {
        formDataUpdated.append('image', formData.image[0].originFileObj);
    }

    console.log('values từ formData: ', formData);

    try {

      const response = await editProductById(id, formData);

      console.log('response api trả về: ', response);

      if (response && response.product) {
        const updatedProduct = {
            ...editingProduct,
            name: formData.productname,
            description: formData.description,
            price: formData.price,
            auctionTime: formData.auctionTime,
            startTime: formData.startTime.toISOString(),
            image: response.product.imageUrl || editingProduct.image,
          };

        console.log('updatedProduct trước set: ', updatedProduct);

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            response.product.id === updatedProduct.id ? updatedProduct : product
          )
        );

        console.log('updatedProduct sau set: ', updatedProduct);

        message.success('Product update successful');
      } else {
        message.error('Product update failed');
      }
    } catch (error) {
      message.error('Product update failed');
    }
}
