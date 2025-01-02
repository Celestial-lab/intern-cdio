import { ethers } from 'ethers';
import abiToken from '@/views/store/abiToken.json';
import abiBid from '@/views/store/abiBid.json';

// Địa chỉ smart contract
const contractAddress = process.env.NEXT_PUBLIC_Contract_Auction;

// Hàm kết nối MetaMask và smart contract
export const connectContract = async (signer) => {
    try {
      const bidContract = new ethers.Contract(contractAddress, abiBid, signer);
      const tokenContract = new ethers.Contract(contractAddress, abiToken, signer);
  
      console.log("Smart contract connected:", bidContract, tokenContract);
      
      return { bidContract, tokenContract };
    } catch (error) {
      console.error("Failed to connect to smart contract:", error);
    }
};
