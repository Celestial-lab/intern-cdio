'use client'


import { checkAllowance } from '@/views/services/user/ProfileServices';

import { message } from 'antd';


export const handleJoinLiveAuction = async(auctionIdLive, registrationId, router) => {
    console.log(`Tham gia đấu giá cho cuộc đấu giá ID: ${auctionIdLive}`);
    console.log(`registrationId: ${registrationId}`);
    if (!localStorage.getItem('userAddress') && !localStorage.getItem('inforId')) {
      message.error('Hãy cập nhật thông tin cá nhân đầy đủ để tham gia đấu giá')
    } else if (!localStorage.getItem('userAddress') && localStorage.getItem('inforId')) {
      message.error('Hãy kết nối ví lại để tham gia đấu giá')
    } else if (localStorage.getItem('userAddress') && localStorage.getItem('inforId')) {
      const userAddress = localStorage.getItem('userAddress');
      const spenderAddress = process.env.NEXT_PUBLIC_Contract_Auction;
      const response = await checkAllowance(spenderAddress, userAddress);

      console.log('allowance trả về', response.allowance);

      if (response.allowance === 0) {
        message.error('hãy Approve trước khi tham gia đấu giá');
      } else {
        message.success('vô nè');

        window.location.href = `/user/LiveAuction/${auctionIdLive}/${registrationId}`;
      }
    }
}