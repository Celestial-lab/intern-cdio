'use client'

import { Button, Modal, Form, Input, message, Select } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import "@/views/style/SignUp.css";
import handleSignUpApi from '../../services/SignUpUserServices';

const SignUp = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');


    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const { email, password, role } = values;
            const response = await handleSignUpApi(email, password, role);

            console.log('response trả về bên frontend: ', response);

            message.success('Sign up successful!');

            // setTimeout(() => {
            //     window.location.href = '/user/signin';
            // }, 1500);
        } catch (error) {

            console.error('Sign up failed:', error);
            message.error('Sign up failed!');
        }
    };

    const handleVerificationSubmit = () => {
        // Xử lý mã xác thực ở đây, ví dụ: kiểm tra mã xác thực
        console.log('Mã xác thực:', verificationCode);
        // Xác thực thành công thì có thể thực hiện điều hướng hoặc thông báo
        message.success('Verification successful!');
    };

    const handleTestOpenModal = (event) => {
        event.preventDefault();
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
      };


    return (
        <>
            <div class="container" id="container">

                <div class="title-container">
                    <div class="overlay">
                        <div class="overlay-panel">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button class="ghost"><a href='/user/signin'>Sign In</a></button>
                        </div>
                    </div>
                </div>

                <div class="overlay-container">
                    <Form form={form}>
                        <h1>Create Account</h1>
                        <span className="description-signup">or use your email for registration</span>
                        <div class="form-signup">

                            <Form.Item
                                name="email"
                                className="formItem"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input className="inputtable" placeholder='Email' type="email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                className="formItem"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input className="inputtable" placeholder='Password' type="password" />
                            </Form.Item>
                            <Form.Item
                                name="role"
                                rules={[{ required: true, message: 'Please select your role!' }]}>
                                <Select
                                    className="inputtable"
                                    placeholder="Select a role"
                                    optionFilterProp="label"
                                    options={[
                                        {
                                            value: 'user',
                                            label: 'User',
                                        },
                                        {
                                            value: 'author',
                                            label: 'Author',
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                        <Button class='but-signup' onClick={handleSubmit}>Sign Up</Button>
                    </Form>
                </div>
            </div>

            <Modal
                open={isModalOpen}
                width={750}
                // height={460}
                footer={null}
                // closable={false}
                onCancel={handleCancel}
                centered
                bodyStyle={{
                    borderRadius: '9px',
                    background: 'linear-gradient(to top, #060b2d, #d2d2d2)',
                }}
            >
                <div className="modal-code">
                    <h2 class='title-modal'>Mã xác thực đã được gửi về Email của bạn!</h2>
                    <Input
                        className="input-code"
                        placeholder="Nhập mã xác thực"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        style={{ width: '60%', marginTop: 20, marginBottom: 20 }}
                    />
                    <Button className="submit-code" type="primary" onClick={handleVerificationSubmit}>Submit Code</Button>
                </div>
            </Modal>
        </>
    )
}

export default SignUp;


// <div className="custom-row">
        //     <Row gutter={[0, 0]}>
        //         <Col span={7} />
        //         <Col span={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        //             <img className='imageLogo' src='/CeLestial-wbg.png' alt='Logo' />
        //             <h2>Join our community</h2>
        //             <p>Start your journey with product</p>
        //             <div className='divInput'>
        // <Form form={form} layout="vertical" method="POST">
        //     <Form.Item
        //         name="email"
        //         label="Email*"
        //         className="formItem"
        //         rules={[{ required: true, message: 'Please input your email!' }]}
        //     >
        //         <Input className="inputtable" />
        //     </Form.Item>
        //     <Form.Item
        //         name="password"
        //         label="Password*"
        //         className="formItem"
        //         rules={[{ required: true, message: 'Please input your password!' }]}
        //     >
        //         <Input className="inputtable" type="password" />
        //     </Form.Item>
        //     <Form.Item
        //         name="role"
        //         label="Select a role"
        //         rules={[{ required: true, message: 'Please select your role!' }]}>
        //         <Select
        //             placeholder="Select a role"
        //             optionFilterProp="label"
        //             // onChange={onChange}
        //             options={[
        //                 {
        //                     value: 'user',
        //                     label: 'User',
        //                 },
        //                 {
        //                     value: 'author',
        //                     label: 'Author',
        //                 },
        //             ]}
        //         />
        //     </Form.Item>

        //                     <Button className='buttonConnect' onClick={handleSubmit}>Sign Up</Button>
        //                     <p style={{ marginTop: '20px', fontSize: '14px' }}>
        //                         Already have an account? <a href="/user/signin" style={{ color: '#22C55E', textDecoration: 'none' }}>Sign In</a>
        //                     </p>
        //                 </Form>
        //             </div>
        //         </Col>
        //         <Col span={7} />
        //     </Row>
        // </div>