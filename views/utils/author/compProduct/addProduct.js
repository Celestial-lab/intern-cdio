'use client'

import { message } from 'antd';
import { handleAddProduct } from '@/views/services/author/AuthorServices';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { createAuction } from '@/views/contract/compContract/createAuction';

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
    // Bước 1: Gọi API để thêm sản phẩm
    const newProductData = await handleAddProduct(formToSubmit);

    if (newProductData) {
      // Bước 2: Sau khi thêm thành công vào backend, gọi smart contract để tạo đấu giá trên blockchain
      const { bidContract } = await connectContract();
      if (bidContract) {
        await createAuction(
          bidContract,
          formData.productname,
          formData.description,
          formData.image[0]?.originFileObj.name || '', // URL ảnh sản phẩm
          ethers.utils.parseUnits(formData.price.toString(), 'ether'), // giá khởi điểm, chuyển đổi sang ether
          formData.auctionTime * 60 // thời gian đấu giá chuyển đổi sang giây
        );

        message.success('Auction created successfully on blockchain!');
      }

      // Cập nhật danh sách sản phẩm sau khi thành công
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
    console.error('Lỗi khi thêm sản phẩm hoặc tạo đấu giá:', error);
    message.error('Failed to create product or auction!');
  } finally {
    setLoading(false);
  }
};
