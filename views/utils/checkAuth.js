

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