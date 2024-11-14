'use client'

import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import "@/views/style/SignIn.css";
import { useAuthContent } from '@/views/store/context/AuthContext';
import { handleSubmitSignin } from '@/views/utils/compSignIn';


const SignIn = () => {
    const [form] = Form.useForm();
    const { login } = useAuthContent();

    const handleSubmit = async () => {
        await handleSubmitSignin(form, login);
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