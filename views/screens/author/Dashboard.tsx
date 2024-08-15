'use client'

import React, { useState } from 'react'
import { Avatar, Button, Col, Form,  Input, Row, type MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import {
  BarChartOutlined,
  BellOutlined,
  DollarOutlined,
  FileOutlined,
  MailFilled,
  ProductOutlined,
  UserOutlined,
  } from '@ant-design/icons';
import "@/views/style/DashboardAuthor.css";
import { Footer } from 'antd/es/layout/layout';


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
  getItem('Dashboard', 'dashboard', <BarChartOutlined />, '/author/settings/DashboardAuthor'),
  getItem('Product', 'product', <ProductOutlined />, '/author/settings/ProductAuthor'),
  getItem('Profile', 'profile', <UserOutlined />, '/author/settings/ProfileAuthor'),
  
];


export default function Dashboard() {

    const [collapsed, setCollapsed] = useState(false);
    const {token: { colorBgContainer }} = theme.useToken();
    const [form] = Form.useForm();

    function onFinish(values: any): void {
        throw new Error('Function not implemented.');
    }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header className='headerInfor'>
            <Row className='row'>

            <Col className='col1' span={12}>
              <div className='name'><p>Hello, DanLe</p></div>
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
            }}><h3>Profile</h3>
            </div>

          <div className='divInfor' style={{padding: 15, minHeight: 485, background: colorBgContainer}}>
            
          </div>
        </Content>

        <Footer>
        </Footer>
      </Layout>
    </Layout>
  )
}
