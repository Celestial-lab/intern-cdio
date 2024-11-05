'use client'

import { Button, Checkbox, Col, Form, Input, Row, message, Select } from "antd";
import React, { useState, useEffect } from "react";
import "@/views/style/SignIn.css";
import handleSignInApi from '../../services/SignInUserServices';

const SignIn = () => {
    const [form] = Form.useForm();
    const [checked, setChecked] = useState(false);

    // Hàm xử lý khi người dùng đăng nhập
    const handleSubmit = async () => {

        try {
            const values = await form.validateFields();
            const { email, password, role } = values;

            console.log('values: ', values);

            const response = await handleSignInApi(email, password, role);

            console.log('response: ', response);

            if (response.user.role === 'user') {
                localStorage.setItem('userId', response.user.id);
                localStorage.setItem('accessToken', response.token);

                console.log('id user: ', localStorage.getItem('userId'));

                if (response.errorCode === 0 && response.user.role === 'user') {
                    message.success('Welcome User!');
                    setTimeout(() => {
                        window.location.href = '/user/settings/Profile';
                    }, 1500)
                    // setTimeout(() => {
                    //     window.location.href = '/';
                    // }, 1500);
                } else {
                    message.error('Invalid email or password!');
                }
            };

            if (response.user.role === 'author') {
                localStorage.setItem('authorId', response.user.id);
                localStorage.setItem('accessToken', response.token);

                console.log('id author: ', localStorage.getItem('authorId'));
                if (response.errorCode === 0 && response.user.role === 'author') {
                    message.success('Welcome Author!');
                    setTimeout(() => {
                        window.location.href = '/author/settings/ProductAuthor';
                    }, 1500)
                } else {
                    message.error('Invalid email or password!');
                }
            };

        } catch (error) {
            console.error('Sign in failed:', error);
            message.error('Sign in failed, please try again!');
        }
    };

    const onChange = (e) => {
        setChecked(e.target.checked);
        console.log(`checked = ${e.target.checked}`);
    };

    return (
        <>
            <div class="container" id="container">
                <div class="form-container sign-in-container">
                    <Form form={form}> 
                        <h1>Sign in</h1>
                        <span>Start your journey with our product</span>
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
                        </div>
                        <Button class='but-signin' onClick={handleSubmit}>Sign In</Button>
                    </Form>
                </div>

                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button class="ghost" id="signUp"><a href="/user/signup">Sign Up</a></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;



// <div className="custom-row">
        //     <Row gutter={[0, 0]}>
        //         <Col span={16}>
        //             <Row>
        //                 <Col span={6} />
        //                 <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        //                     <img className='imageLogoCelectial' src='/CeLestial-wbg.png' alt='Logo' />
        //                     <h2>Welcome Back User</h2>
        //                     <p>Start your journey with our product</p>
        //                     <div className='divInput'>
        //                         <Form form={form} layout="vertical">
        //                             <Form.Item
        //                                 name="email"
        //                                 label="Email*"
        //                                 rules={[{ required: true, message: 'Please input your email!' }]}>
        //                                 <Input className="inputtable" />
        //                             </Form.Item>
        //                             <Form.Item
        //                                 name="password"
        //                                 label="Password*"
        //                                 rules={[{ required: true, message: 'Please input your password!' }]}>
        //                                 <Input className="inputtable" type="password" />
        //                             </Form.Item>
        //                             <div className="options-row">
        //                                 <label className="custom-checkbox">
        //                                     <Checkbox onChange={onChange} className="hidden-checkbox" />
        //                                     <span className="checkmark"></span>
        //                                     Remember me
        //                                 </label>
        //                                 <a href="/user/signup" className="forgot-link">Forgot your password?</a>
        //                             </div>
        //                             <Button className='buttonConnect' onClick={handleSubmit}>Sign In</Button>
        //                             <p style={{ marginTop: '20px', fontSize: '14px' }}>
        //                                 Don’t have an account? <a href="/user/signup" style={{ color: '#22C55E', textDecoration: 'none' }}>Sign Up</a>
        //                             </p>
        //                         </Form>
        //                     </div>
        //                 </Col>
        //                 <Col span={6} />
        //             </Row>
        //         </Col>
        //         <Col span={8}>
        //             <img className='imageLogo' src='/ImagebackGround.jpg' alt='Logo' />
        //         </Col>
        //     </Row>
        // </div>