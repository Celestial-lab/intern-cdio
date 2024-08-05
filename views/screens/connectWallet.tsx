'use client'

import React from 'react';
import { Row, Col, Button, Form, Input, } from "antd";
import "@/views/style/ConnectWallet.css";

const ConnectWallet = () => {

  const [form] = Form.useForm();

  return (
    <body>
    <div className='container'>
      <Row className='row'>
        <Col className='colForm' xs={16} lg={16} >
          <div className='divForm'>
              <Row className='row1'>
                <div className='divRow1'>
                  <Row className='row11'>
                      <img className='imageLogo' src='./Celestial-wbg.png'></img>
                  </Row>
                  <Row className='row12'>
                    <Col className='colne1' span={7}></Col>

                    <Col className='colSlogan' span={10}>
                        <div className='divSlogan'>
                            <h2>Join our community</h2>
                            <h5>Start your journey with product</h5>
                        </div>
                    </Col>

                    <Col className='colne3' span={7}></Col>
                  </Row>
                </div>
              </Row>
            
              <Row className='row2'>
                <Col span={6}></Col>

                <Col className='inputForm' span={12}>
                <div className='divInput'>
                  <Form form={form} layout="vertical">
                      <Form.Item name="name" label="Name*">
                        <Input />
                      </Form.Item>
                      <Form.Item name="email" label="Email*">
                        <Input />
                      </Form.Item>
                      <Form.Item name="address" label="Wallet address*">
                        <Input />
                      </Form.Item>
                      <Button className='buttonConnect' onClick={(e) => {
          e.preventDefault();
          window.location.href = '/settings/profile';
        }}> Connect Wallet</Button>
                  </Form>
                  </div>
                </Col>

                <Col span={6}></Col>
              </Row>
            

              <Row className='row3'>
              </Row>
            
          </div>
        </Col>


        <Col className='colImage' xs={8} lg={8} >
          <img className='imageConnect' src='./connectWallet.jpg'></img> 
        </Col>

      </Row>
    </div>
    </body>
  );
};

export default ConnectWallet;