'use client'


import { checkAllowance } from '@/views/services/user/ProfileServices';

import { message } from 'antd';


export const handleJoinLiveAuction = async (auctionIdLive, registrationId) => {
  window.location.href = `/user/LiveAuction/${auctionIdLive}/${registrationId}`;
}


export const checkIsJoin = async (setIsCanJoin) => {
  if (!localStorage.getItem('inforId')) {
    message.warning('Please update your information completely to participate in the auction')
     return setIsCanJoin(1);
  } else {
    const userAddress = localStorage.getItem('userAddress');
    const spenderAddress = process.env.NEXT_PUBLIC_Contract_Auction;
    const response = await checkAllowance(spenderAddress, userAddress);
    if (response.allowance === '0' || response.allowance === '0.0') {
      message.warning('Please Approve before Join Auction');
      return setIsCanJoin(1);
    }
  } 

}