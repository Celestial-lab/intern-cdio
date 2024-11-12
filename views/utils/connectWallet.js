'use client'

import { ethers } from 'ethers';
import { message } from 'antd';
import { editInforById } from '@/views/services/user/ProfileServices';
import { AuthContext } from '@/views/store/context/AuthContext';
import { useContext } from "react";


export const connectWallet = async(form, updateProfile, profile, role, login) => {

  console.log('role: ', role);

  console.log('role: ', login);
    // try {
    //     if (!window.ethereum) {
    //       message.error('MetaMask is not installed!');
    //       return;
    //     }


    
    //     const provider = new ethers.BrowserProvider(window.ethereum);
    //     await provider.send("eth_requestAccounts", []);
    //     const signer = await provider.getSigner();
    //     const walletAddress = await signer.getAddress();
    //     const balance = await provider.getBalance(walletAddress);
    //     const balanceInEth = ethers.formatEther(balance);
    //     const formattedBalance = parseFloat(balanceInEth).toFixed(3);
    
    //     // Lưu số dư vào localStorage
    //     localStorage.setItem('userBalance', formattedBalance);
    //     localStorage.setItem('userAddress', walletAddress);
  
    
    //     // Cập nhật trường walletAddress trong form
    
    //     const inforId = localStorage.getItem('inforId');
    
    //     if (!inforId) {
    //       // Nếu không có inforId, chỉ cập nhật trường walletAddress trong form
    //       message.info('Vui lòng thêm thông tin cá nhân trước khi kết nối ví.');
    //       // Thực hiện hành động để thêm thông tin nếu cần
    //       // Có thể mở modal hoặc thực hiện một hành động nào đó
  
    //       form.setFieldsValue({
    //         walletAddress: walletAddress,
    //       });
  
    //     } else {
    //       // Nếu đã có inforId, cập nhật profile với địa chỉ ví
    //       const updatedProfile = {
    //         ...profile,
    //         walletAddress: walletAddress,
    //       };
    
    //       console.log('updatedProfile: ', updatedProfile);
      
    //       const response = await editInforById(inforId, updatedProfile);
    
    //       console.log('response sau connect: ', response);
      
    //       if (response) {
    //         updateProfile(updatedProfile);
    //         message.success('Wallet connected and updated successfully!');
    
    //         // Cập nhật số tiền hiển thị
    //         const showTotalMoneyDiv = document.querySelector('.showTotalMoney');
    //         if (showTotalMoneyDiv) {
    //           showTotalMoneyDiv.textContent = `${formattedBalance} $`;
    //         }
    //       } else {
    //         message.error('Failed to update wallet address!');
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Failed to connect wallet:', error);
    //     message.error('Failed to connect wallet!');
    //   }
}