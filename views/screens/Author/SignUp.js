'use client'

import { Button, Checkbox, Col, Form, Input, Row, Modal, message } from "antd";
import React, { useState } from "react";
import "@/views/style/SignUpAuthor.css";

const SignUpAuthor = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        form.validateFields()
            .then(values => {
                // Show confirmation modal
                setIsModalVisible(true);
            })
            .catch(errorInfo => {
                message.error('Please fill in all required fields.');
            });
    };

    const handleOk = () => {
        window.location.href = '/user/settings/Profile';
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };

    return (
        <div className="custom-row">
            <Row gutter={[0, 0]}>
                <Col span={7} />
                <Col span={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img className='imageLogo' src='/CeLestial-wbg.png' alt='Logo'/>
                    <h2>Welcome author</h2>
                    <p>Showcase Your Creations to the World</p>
                    <div className='divInput'>
                        <Form form={form} layout="vertical">
                            <Form.Item 
                                name="name" 
                                label="Name*" 
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input className="inputtable"/>
                            </Form.Item>
                            <Form.Item 
                                name="email" 
                                label="Email*" 
                                className="formItem" 
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input className="inputtable"/>
                            </Form.Item>
                            <Form.Item 
                                name="address" 
                                label="Password*" 
                                className="formItem" 
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input className="inputtable" type="password" />
                            </Form.Item>
                            <div className="options-row">
                            <label className="custom-checkbox">
                            <Checkbox onChange={onChange} className="hidden-checkbox"/> 
                            <span className="checkmark"></span>
                            I commit to take responsibility for customer information security policy, dispute resolution mechanism, and operating regulations on the Website
                            </label>
                    
                            </div>
                            <Button className='buttonConnect' onClick={handleSubmit}>Sign Up</Button>
                            <p style={{ marginTop: '20px' ,fontSize:'14px'}}>
                                Already have an account? <a href="/user/signin" style={{ color: '#22C55E', textDecoration: 'none' }}>Sign In Author</a>
                            </p>
                        </Form>
                    </div>
                </Col>
                <Col span={7} />
            </Row>

            <Modal
                title="Confirmation"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
            >
                <p>Each product will cost 5-7%. So please read carefully and click Yes.</p>
            </Modal>
        </div>
    );
}

export default SignUpAuthor;
