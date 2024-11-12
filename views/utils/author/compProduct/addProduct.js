'use client'

import { message } from 'antd';
import { handleAddProduct } from '@/views/services/author/AuthorServices';
import moment from 'moment';
import React, { useState, useEffect } from 'react';

export const handleAddNewProduct = async (formData, setLoading, setProducts, handleCancel) => {
  const authorId = localStorage.getItem('authorId');
  if (!authorId) {
    console.error('Không tìm thấy ID tác giả.');
    return;
  }

  const formToSubmit = new FormData();
  formToSubmit.append('loginId', authorId);
  formToSubmit.append('productname', formData.productname);
  formToSubmit.append('description', formData.description);
  formToSubmit.append('startingPrice', formData.price);
  formToSubmit.append('durationInMinutes', formData.auctionTime);
  
  if (formData.startTime instanceof Date) {
    formToSubmit.append('startTime', formData.startTime.toISOString());
  } else {
    const startTimeDate = new Date(formData.startTime);
    if (isNaN(startTimeDate)) {
      console.error('startTime không hợp lệ');
    } else {
      formToSubmit.append('startTime', startTimeDate.toISOString());
    }
  }

  if (formData.image && formData.image[0] && formData.image[0].originFileObj) {
    formToSubmit.append('image', formData.image[0].originFileObj);
  } else {
    console.error('Ảnh không tồn tại hoặc không hợp lệ');
  }

  setLoading(true);
  try {
    const newProductData = await handleAddProduct(formToSubmit);
    if (newProductData) {
      const newProduct = {
        key: newProductData.product.id,
        name: newProductData.product.productName,
        image: newProductData.product.image || newProductData.product.imageUrl,
        description: newProductData.product.description,
        price: newProductData.product.startingPrice,
        status: newProductData.product.active,
        auctionTime: newProductData.product.endTime,
        startTime: newProductData.product.startTime,
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      message.success('Upload thành công');
      handleCancel();
    } else {
      console.error('Thêm sản phẩm thất bại');
    }
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
  } finally {
    setLoading(false);
  }
};
