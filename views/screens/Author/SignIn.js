'use client'

import { Button, Checkbox, Col, Form, Input, Row, message } from "antd"; // Thêm message để hiển thị thông báo
import React, { useState } from "react";
import "@/views/style/SignIn.css";
import handleSignInAuthor from "@/views/services/SignInAuthorServices";

const SignInAuthor = () => {
    const [form] = Form.useForm();
    const [checked, setChecked] = useState(false); // Thêm state cho checkbox

    const handleSubmit = async () => {
        try {
            // Validate các trường input trước khi gửi request
            const values = await form.validateFields();
            const { email, password } = values;

            
            const response = await handleSignInAuthor(email, password);

            if (response && response.errorCode === 0) {
                
                message.success(response.message || 'Sign in successful!');
                
                
                setTimeout(() => {
                    window.location.href = '/author/settings/DashboardAuthor';
                }, 1500);
            } else {
                
                message.error(response?.message || 'Invalid email or password!');
            }
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
        <div className="custom-row">
            <Row gutter={[0, 0]}>
                <Col span={16}>
                    <Row>
                        <Col span={6} />

                        <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <img className='imageLogoCelectial' src='/CeLestial-wbg.png' alt='Logo' />
                            <h2>Welcome Back Author</h2>
                            <p>Let Your Talent Reach Enthusiastic Buyers</p>
                            <div className='divInput'>
                                <Form form={form} layout="vertical">
                                    <Form.Item
                                        name="email"
                                        label="Email*"
                                        rules={[{ required: true, message: 'Please input your email!' }]}
                                    >
                                        <Input className="inputtable" />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        label="Password*"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input className="inputtable" type="password" />
                                    </Form.Item>
                                    <div className="options-row">
                                        <label className="custom-checkbox">
                                            <Checkbox onChange={onChange} className="hidden-checkbox" />
                                            <span className="checkmark"></span>
                                            Remember me
                                        </label>
                                        <a href="/user/signup" className="forgot-link">Forgot your password?</a>
                                    </div>
                                    <Button className='buttonConnect' onClick={handleSubmit}>Sign In</Button>
                                    <p style={{ marginTop: '20px', fontSize: '14px' }}>
                                        Don’t have an account? <a href="/user/signup" style={{ color: '#22C55E', textDecoration: 'none' }}>Sign Up Author</a>
                                    </p>
                                </Form>
                            </div>
                        </Col>
                        <Col span={6} />
                    </Row>
                </Col>
                <Col span={8}>
                    <img className='imageLogo' src='/ImagebackGround.jpg' alt='Logo' />
                </Col>
            </Row>
        </div>
    );
};

export default SignInAuthor;
