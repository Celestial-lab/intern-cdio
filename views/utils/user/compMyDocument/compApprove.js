'use client'

import { ethers } from 'ethers';


export const handleApprove = async() => {
    try {
        let userAddress = localStorage.getItem('userAddress');
        if (!userAddress) {
          alert("Bạn chưa thêm thông tin và kết nối ví. Để thực hiện chức năng Approve, hãy thêm thông tin và kết nối ví");
          if (!window.ethereum) {
            alert("Vui lòng cài đặt MetaMask!");
            return;
          }
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          userAddress = localStorage.getItem('userAddress');
          if (!userAddress) {
            return;
          }
        }
  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
  
        // Địa chỉ token và số lượng approve
        const tokenAddress = "0x65162C4d8dd16594546338C9C637105C031288cF";
        const spenderAddress = "0xDeAFB1df5c2738a2106D28fCcF12e97F76Ef3BD9";
        const approveAmount = ethers.parseUnits("10", 18);
  
        const tokenABI = [
          "function approve(address spender, uint256 amount) public returns (bool)"
        ];
  
        // Khởi tạo đối tượng hợp đồng token
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        console.log("Hợp đồng token đã được tạo:", tokenContract);
  
        // Gửi giao dịch approve
        const transaction = await tokenContract.approve(spenderAddress, approveAmount);
        console.log("Đang thực hiện approve, đợi xác nhận giao dịch...");
        await transaction.wait();
        console.log("Giao dịch approve hoàn tất:", transaction);
        alert("Approve thành công!");
  
      } catch (error) {
        console.error("Lỗi khi thực hiện approve:", error);
        alert("Đã xảy ra lỗi khi thực hiện approve: " + error);
      }
}