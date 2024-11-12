'use client'

import { Button, Checkbox, Col, Form, Input, Row, message, Select } from "antd";
import React, { useState, useEffect, useContext } from "react";
import "@/views/style/SignIn.css";
import handleSignInApi from '../../services/SignInUserServices';
import { AuthContext } from "@/views/store/context/AuthContext";

const SignIn = () => {
    const [form] = Form.useForm();
    const [checked, setChecked] = useState(false);
    const { login } = useContext(AuthContext);

    const handleSubmit = async () => {

        try {
            const values = await form.validateFields();
            const { email, password  } = values;

            const response = await handleSignInApi(email, password);

            console.log('response: ', response);

            localStorage.setItem('loginId', response.user.id);

            if (response.errorCode === 0){
                message.success('Sign-in successful!');

                login(response.user.email, response.user.role);

                if (response.user.role === 'user') {

                    localStorage.setItem('userId', response.user.id);
                    localStorage.setItem('accessToken', response.token);
                    message.success('Welcome User!');
                    // setTimeout(() => {
                    //     window.location.href = '/user/settings/Profile';
                    // }, 1500)
                } else if (response.user.role === 'author') {
                    localStorage.setItem('authorId', response.user.id);
                    localStorage.setItem('accessToken', response.token);
                    message.success('Welcome Author!');
                    setTimeout(() => {
                        window.location.href = '/author/settings/ProductAuthor';
                    }, 1500);
                }
            } else {
                message.error('Invalid email or password!');
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