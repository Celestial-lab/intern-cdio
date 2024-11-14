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
        const tokenAddress = "0x4f4DcDab99C23D37451c2A369AEd4255dF4bDfb8";
        const spenderAddress = "0x00E0DAd8665a5d70B3aAE546a9182186a3b94cCf";
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