'use client'

import { Button, Col, Form, Input, Row } from "antd";
import React from "react";
import "@/views/style/SignUp.css";

const SignUp = () => {
    const [form] = Form.useForm();

    const handleSubmit = (e) => {
        e.preventDefault();

        form.validateFields()
            .then(values => {
               
                window.location.href = '/user/settings/Profile';
            })
            .catch(errorInfo => {
        
                message.error('Please fill in all required fields.');
            });
    };
    return(
        <div className="custom-row">
            <Row gutter={[0, 0]}>
                <Col span={7} />
                <Col span={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img className='imageLogo' src='/CeLestial-wbg.png' alt='Logo'/>
                <h2>Join our community</h2>
                <p>Start your journey with product</p>
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
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input className="inputtable"/>
                    </Form.Item>
                    <Form.Item 
                        name="address" 
                        label="Password*" 
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input className="inputtable" type="password" />
                    </Form.Item>
                    <Button className='buttonConnect' onClick={handleSubmit}>Sign Up</Button>
                    <p style={{ marginTop: '20px' ,fontSize:'14px'}}>
                    Already have an account? <a href="/user/signin" style={{ color: '#22C55E', textDecoration: 'none' }}>Sign In</a>
                    </p>
                </Form>
            </div>
        </Col>

                <Col span={7} />
            </Row>
        </div>

    )
}
export default SignUp;