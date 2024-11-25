'use client';

import { ethers } from 'ethers';
import { message } from 'antd';
import { editInforById } from '@/views/services/user/ProfileServices';
import { connectContract } from '@/views/contract/connectContract';


const connect = async () => {
  if (!window.ethereum) {
    message.error('MetaMask is not installed!');
    return null;
  }
  try {
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
    // Kiểm tra và thêm mạng Holesky nếu cần
    const { chainId } = await provider.getNetwork();
    if (chainId !== parseInt(holeskyNetwork.chainId, 16)) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [holeskyNetwork],
      });
    }

    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();
    const balance = await provider.getBalance(walletAddress);
    const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(3);
    return { walletAddress, formattedBalance, signer };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    message.error('Failed to connect wallet!');
    return null;
  }
};

const editProfile = async (form ,walletAddress, profile, updateProfile) => {
  const inforId = localStorage.getItem('inforId');
  const values = await form.validateFields();

  if (!inforId) {
    message.info('Vui lòng thêm thông tin cá nhân trước khi kết nối ví.');
    form.setFieldsValue({ walletAddress });
    return;
  }

  const updatedProfile = { ...profile };
  //check xem walletAddress có thay đổi không?
  const isWalletAddressChanged = values.walletAddress && values.walletAddress !== profile.walletAddress;

  if (!isWalletAddressChanged) {
    message.info('Bạn đã kết nối ví này!');
    delete updatedProfile.walletAddress;
    return true;
  } else {
    updatedProfile.walletAddress = values.walletAddress;
    try {
      const response = await editInforById(inforId, updatedProfile);
      console.log('response: ', response);
      if (response) {
        updateProfile(updatedProfile);
        message.success('Wallet connected and updated successfully!');
        return true;
      } else {
        message.error('Failed to update wallet address!');
        return false;
      }
    } catch (error) {
      console.error('Failed to update wallet address:', error);
      message.error('Error occurred while updating profile!');
      return false;
    }
  }
};

export const connectWallet = async (form, updateProfile, profile, state) => {
  const connection = await connect();
  if (!connection) {
    return;
  }
  const { walletAddress, formattedBalance, signer } = connection;

  // Lưu thông tin vào localStorage
  if (state.role === 'user') {
    localStorage.setItem('userBalance', formattedBalance);
    localStorage.setItem('userAddress', walletAddress);
  } else if (state.role === 'author') {
    localStorage.setItem('authorBalance', formattedBalance);
    localStorage.setItem('authorAddress', walletAddress);
  }

  // Cập nhật profile
  const isUpdated = await editProfile(form ,walletAddress, profile, updateProfile);

  if (isUpdated) {
    await connectContract(signer);
  };
};

export const connectWalletFromAddModal = async (form, updateProfile, profile, state) => {
  const connection = await connect();
  
  if (!connection) {
    return;
  }
  message.success('Kết nối ví thành công'); //thích thì xoá
  const { walletAddress } = connection;
  form.setFieldsValue({ walletAddress });
  try {
    // Lấy giá trị từ form
    const values = await form.validateFields();
    const requiredFields = ['fullName', 'dateOfBirth', 'gender', 'country'];
    const isComplete = requiredFields.every(field => values[field]);
    if (!isComplete) {
      message.warning('Hãy nhập đủ các trường!');
    } else {
      message.success('Nhập đầy đủ! ');
    }
  } catch (error) {
    message.warning('Hãy nhập đủ các trường!');
  }
};

export const autoConnectWallet = async (userId, profile, updateProfile) => {
  if (!userId) {
    console.warn('User is not logged in.');
    return;
  }
  
  try {
    const response = await fetchWalletAddressByUserId(userId);
    if (response && response.walletAddress) {
      console.log('Found wallet address:', response.walletAddress);

      // Kết nối ví nếu đã có địa chỉ
      const connection = await connect();
      if (connection) {
        message.success('Auto-connected wallet successfully!');
      }
    } else {
      console.log('Bạn chưa thêm thông tin cá nhân.');
    }
  } catch (error) {
    console.error('Failed to fetch wallet address:', error);
  }
};