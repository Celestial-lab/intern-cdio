'use client'

import { Button, Modal, Form, Input, Select } from "antd";
import React, { useState } from "react";
import "@/views/style/SignUp.css";
import { handleSubmitSignup, handleVerificationSubmit } from '@/views/utils/compSignUp';

const SignUp = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal] = Form.useForm();
    const [attemptsLeft, setAttemptsLeft] = useState(3);

    const handleSubmit = async () => {
        await handleSubmitSignup(form, setIsModalOpen);
    };

    const handleSubmitCode = async () => {
        await handleVerificationSubmit(form, formModal, attemptsLeft, setAttemptsLeft, setIsModalOpen);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="container" id="container">
                <div className="title-container">
                    <div className="overlay">
                        <div className="overlay-panel">
                            <h1 className="welcome-back">Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost"><a href='/user/signin'>Sign In</a></button>
                        </div>
                    </div>
                </div>
                <div className="overlay-container">
                    <Form form={form}>
                        <h1 className="tit-Create">Create Account</h1>
                        <span className="description-signup">or use your email for registration</span>
                        <div className="form-signup">

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
                                            label: 'Participant',
                                        },
                                        {
                                            value: 'author',
                                            label: 'Artist',
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                        <Button className='but-signup' onClick={handleSubmit}>Sign Up</Button>
                    </Form>
                </div>
            </div>
            <Modal
                open={isModalOpen}
                width={750}
                footer={null}
                closable={true}
                onCancel={handleCancel}
                centered
            >
                <div className="modal-code">
                    <h2 className='title-modal'>Verification code has been sent to your Email!</h2>
                    <Form className="form-code" form={formModal}>
                        <Form.Item
                            name="code"
                            rules={[{ required: true, message: 'Please enter the verification code!' }]}
                        >
                            <Input placeholder="Enter verification code" />
                        </Form.Item>
                    </Form>
                    <Button className="submit-code" type="primary" onClick={handleSubmitCode}>Submit Code</Button>
                </div>
            </Modal>
        </>
    )
}

export default SignUp;