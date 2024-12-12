'use client'

import { getInforById } from "@/views/services/user/ProfileServices";

export const checkAuth = async() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      message.error("Vui lòng đăng nhập lại");
      setTimeout(() => {
        window.location.href = '/user/signin';
      }, 1500);
    } else {
      console.log("Token hợp lệ, tiếp tục truy cập trang");
    }
}

export const getInforId = async() => {
  if (localStorage.getItem('role') == 'user') {
    const userId = localStorage.getItem('userId');
    try {
      const response = await getInforById(userId);
      console.log('response: ', response);
      switch (response.errorCode) {
        case 1:
          message.warning('You have not added personal information, please add information to be able to bid!');
          return;
        case 0:
          if (response.data) {
            localStorage.setItem('inforId', response.data.id);
          } else {
            console.log('No profile data found for the given loginId');
          }
          return;
        default:
          console.error('Unexpected error code:', response.errorCode);
          message.error('Đã xảy ra lỗi không xác định.');
          return;
      };
    } catch (error) {
      console.error('Failed to get InforId:', error);
    }
  } else {
    return;
  }
}