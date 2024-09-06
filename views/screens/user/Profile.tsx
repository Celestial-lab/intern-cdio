'use client'

import axios from "../../axios";
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Col, Form, Input, Row, type MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import {
  AppstoreOutlined,
  BellOutlined,
  DollarOutlined,
  FileOutlined,
  HistoryOutlined,
  MailFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import "@/views/style/Profile.css";
import { Footer } from 'antd/es/layout/layout';
import getProfileByEmail from '../../services/user/ProfileServices';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  href?: string,
): MenuItem {
  return {
    key,
    icon,
    label: <a href={href}>{label}</a>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Profile', 'profile', <AppstoreOutlined />, '/user/settings/Profile'),
  getItem('Cart', 'cart', <ShoppingCartOutlined />, '/user/settings/Cart'),
  getItem('Auction History', 'auctionHistory', <HistoryOutlined />, '/user/settings/AuctionHistory'),
  getItem('My Document', 'myDocument', <FileOutlined />, '/user/settings/MyDocument'),
];

export default function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  
  const { token: { colorBgContainer } } = theme.useToken();

  const [form] = Form.useForm();
  
  const [profile, setProfile] = useState({
    nickname: '',
    email: '',
    createdAt: '',
  });

  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const email = localStorage.getItem('userEmail'); // Lấy email từ localStorage
      if (email) {
        try {
          const response = await getProfileByEmail(email);
          const data = response.data;
          if (data) {
            setProfile({
              nickname: data.nickname,
              email: data.email,
              createdAt: data.createdAt || '1 month ago',
            });
          } else {
            console.log('No profile data found for the given email');
          }
        } catch (error) {
          setError('Failed to fetch profile data');
          console.error('Failed to fetch profile:', error);
        }

      } 
    };

    fetchProfileData();
  }, []);
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['profile']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header className='headerInfor'>
          <Row className='row'>
            <Col className='col1' span={12}>
              <div className='name'><p>Hello, {profile.nickname}</p></div>
              <div className='date'><p>Tue, 29 July 2024</p></div>
            </Col>
            <Col className='col2' span={12}>
              <Row className='headerRight'>
                <div className='iconBell'><BellOutlined style={{color: 'grey'}}/></div>
                <div className='iconDollar'><DollarOutlined style={{color: 'grey'}}/>
                  <div className='showTotalMoney'>:</div>
                </div>
                <div className='avt1'><Avatar shape="square" style={{color: 'grey', background: 'white'}} size={40} icon={<UserOutlined />} /></div>
              </Row>
            </Col>
          </Row>
        </Header>

        <Content className='contInfor' style={{ margin: '0 16px' }}>
          <div className='divTitle' style={{
              padding: 5,
              maxHeight: 60,
              background: colorBgContainer,
            }}><h3>Profile</h3></div>

          <div className='divInfor' style={{padding: 15, minHeight: 485, background: colorBgContainer}}>
            <Row className='row1'>
              <Col className='colAvt' span={12}>
                <Row className='rowName'>
                  <Col span={3.5}>
                    <Avatar shape="circle" style={{color: 'grey', background: '#e7e7e7'}} size={75} icon={<UserOutlined />} />
                  </Col>
                  <Col className='colName' span={20.5}>
                    <div className='divName'>
                      <p>
                        <span className='textName'>{profile.nickname}</span> <br />
                        <span className='textEmail'>{profile.email}</span>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col className='colEdit' span={12}>
                <Button className='buttonEdit' type="text">Edit</Button>
              </Col>
            </Row>

            <Row className='row2'>
              <Col className='colInput1' span={12}>
                <div className='divInput1'>
                  <Form form={form} layout="vertical">
                    <Form.Item name="full-name" label="Full Name:">
                      <Input placeholder="Full Name" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender:">
                      <Input placeholder="Gender" />
                    </Form.Item>
                    <Form.Item name="wallet-address" label="Wallet Address:" >
                      <Input placeholder="Wallet Address" />
                    </Form.Item>
                  </Form>
                </div>
              </Col>
              <Col className='colInput2' span={12}>
                <div className='divInput2'>
                  <Form form={form} layout="vertical">
                    <Form.Item name="date" label="Date of birth:">
                      <Input placeholder="Date of birth" />
                    </Form.Item>
                    <Form.Item name="country" label="Country:">
                      <Input placeholder="Country" />
                    </Form.Item>
                  </Form>
                </div>
              </Col>
            </Row>

            <Row className='row3'>
              <Col className='col1' span={12}>
                <Row className='row31'>
                  <div>
                    <span className='textEmailAddress'>My email Address</span>
                  </div>
                </Row>
                <Row className='row32'>
                  <Col className='colIconEmail' span={3.5}>
                    <Avatar shape='circle' style={{color: '#22C55E', background: '#e7e7e7'}} size={35} icon={<MailFilled />}></Avatar>
                  </Col>
                  <Col className='colEmail' span={20.5}>
                    <span className='textMail'>{profile.email}</span> <br />
                    <span className='textMonth'>{profile.createdAt}</span>
                  </Col>
                </Row>
                <Row className='row33'>
                  <div>
                    <Button className='buttonEdit' type="text">+Add Email Address</Button>
                  </div>
                </Row>
              </Col>

              <Col className='col2' span={12}>
              </Col>
            </Row>
          </div>
        </Content>

        <Footer>
        </Footer>

      </Layout>
    </Layout>
  );
}
