
import { message } from "antd";
import { handleSignUpApi, getUserByLoginId, verifiedByCode } from '@/views/services/SignUpUserServices';

export const handleSubmitSignup = async (form, setIsModalOpen) => {
    try {
        const values = await form.validateFields();
        const { email, password, role } = values;
        const response = await handleSignUpApi(email, password, role);
        localStorage.setItem('loginId', response.user.id);
        if (response.user.verified == false) {
            message.success('đăng kí thành công! hãy nhập mã code để xác minh tài khoản');
            setIsModalOpen(true);
        } else {
            message.success('đăng kí và xác minh thành công');
        }
    } catch (error) {
        console.error('Sign up failed:', error);
        message.error('Sign up failed!');
    }
}

export const handleVerificationSubmit = async (form, formModal, attemptsLeft, setAttemptsLeft, setIsModalOpen) => {
    const loginId = localStorage.getItem('loginId');
    try {
        const { code } = await formModal.validateFields(['code']);
        const email = form.getFieldValue('email');
        const response = await verifiedByCode(email, code);
        const getVerify = await getUserByLoginId(loginId);
        console.log('Kết quả hàm getVerify:', getVerify);

        if (getVerify.verified == false) {
            if (attemptsLeft > 1) {
                setAttemptsLeft(attemptsLeft - 1);
                message.warning(`Sai mã xác thực. Còn ${attemptsLeft - 1} lần thử.`);
            } else {
                message.error('Xác minh thất bại, đăng ký không thành công');
                setIsModalOpen(false);
            }
        } else {
            message.success('Xác minh thành công!');
            setIsModalOpen(false);
            setTimeout(() => {
                window.location.href = '/user/signin';
            }, 1500);
        }
    } catch (error) {
        console.error('Xác minh thất bại:', error);
    }
}