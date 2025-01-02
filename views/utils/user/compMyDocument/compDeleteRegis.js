'use client'

import { deleteRegisterAuction } from '@/views/services/user/ProfileServices';
import { message } from 'antd';


export const handleDeleteRegis = async(registrationId, setRegisteredAuctions) => {
    try {
        const response = await deleteRegisterAuction(registrationId);
        console.log('Response trả về sau khi gọi API: ', response);
        if (response) {
            if (response.errorCode == 0) {
                message.success('Unsubscribe successfully');
            } else {
                message.error('Product deletion failed');
            }
        }
      } catch (error) {
        console.error('Có lỗi xảy ra khi xóa sản phẩm:', error);
      }
}