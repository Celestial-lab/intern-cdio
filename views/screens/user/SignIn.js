'use client'

import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import React from "react";
import "@/views/style/SignIn.css";

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
    const onChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
      };
    
    return(
        <div className="custom-row">
           <Row gutter={[0,0]}>
             <Col span={16}>
              <Row>
              <Col span={6}/>
               
              <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <img className='imageLogoCelectial' src='/CeLestial-wbg.png' alt='Logo'/>
                <h2>Welcome Back User</h2>
                <p>Start your journey with our product</p>
                <div className='divInput'>
                <Form form={form} layout="vertical">
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
                    <div className="options-row">
                        <label className="custom-checkbox">
                        <Checkbox onChange={onChange} className="hidden-checkbox"/> 
                        <span className="checkmark"></span>
                             Remember me
                        </label>
                        <a href="/user/signup" className="forgot-link">Forgot your password?</a>
                    </div>
                    <Button className='buttonConnect' onClick={handleSubmit}>Sign In</Button>
                    <p style={{ marginTop: '20px' ,fontSize:'14px'}}>
                    Don’t have an account? <a href="/user/signup" style={{ color: '#22C55E', textDecoration: 'none' }}>Sign Up</a>
                    </p>
                </Form>
            </div>

               </Col>
               <Col span={6}/>
              </Row>
             </Col>
             <Col span={8}>
             <img className='imageLogo' src='/ImagebackGround.jpg' alt='Logo'/>
             </Col>
           </Row>  
        </div>

    )
}
export default SignUp;