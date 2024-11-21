'use client';

import { ethers } from 'ethers';
import { message } from 'antd';
import { editInforById } from '@/views/services/user/ProfileServices';
import { connectContract } from '@/views/contract/connectContract';

export const connectWallet = async (form, updateProfile, profile, state) => {
  console.log('role: ', state.role);

  try {
    if (!window.ethereum) {
      message.error('MetaMask is not installed!');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    // Thông tin về mạng Holesky
    const holeskyNetwork = {
      chainId: '0x4268',
      chainName: 'Holesky Test Network',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://1rpc.io/holesky'],
      blockExplorerUrls: ['https://holesky.beaconcha.in/'],
    };

    // Kiểm tra và thêm mạng Holesky nếu chưa có
    const { chainId } = await provider.getNetwork();
    if (chainId !== parseInt(holeskyNetwork.chainId, 16)) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [holeskyNetwork],
      });
    }

    // Yêu cầu kết nối ví
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();
    const balance = await provider.getBalance(walletAddress);
    const balanceInEth = ethers.formatEther(balance);
    const formattedBalance = parseFloat(balanceInEth).toFixed(3);

    if (state.role === 'user') {
      localStorage.setItem('userBalance', formattedBalance);
      localStorage.setItem('userAddress', walletAddress);
    } else if (state.role === 'author') {
      localStorage.setItem('authorBalance', formattedBalance);
      localStorage.setItem('authorAddress', walletAddress);
    }

    const inforId = localStorage.getItem('inforId');
    if (!inforId) {
      message.info('Vui lòng thêm thông tin cá nhân trước khi kết nối ví.');
      form.setFieldsValue({ walletAddress });
    } else {
      const updatedProfile = { ...profile, walletAddress };
      console.log('updatedProfile: ', updatedProfile);

      const response = await editInforById(inforId, updatedProfile);
      console.log('response sau connect: ', response);

      if (response) {
        updateProfile(updatedProfile);
        message.success('Wallet connected and updated successfully!');
        const showTotalMoneyDiv = document.querySelector('.showTotalMoney');
        if (showTotalMoneyDiv) {
          showTotalMoneyDiv.textContent = `${formattedBalance} $`;
        }
        await connectContract(signer);
      } else {
        message.error('Failed to update wallet address!');
      }
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    message.error('Failed to connect wallet!');
  }
};