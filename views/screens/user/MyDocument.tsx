'use client'

import React, { useState } from 'react'
import { Avatar, Button, Col, DatePicker, Form, Input, Row, Table, type MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import {
  AppstoreOutlined,
  BellOutlined,
  DollarOutlined,
  FileOutlined,
  HistoryOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  } from '@ant-design/icons';
import "@/views/style/MyDocument.css";
import { Footer } from 'antd/es/layout/layout';
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';

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
  


const MyDocument = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {token: { colorBgContainer }} = theme.useToken();
    const onChange: DatePickerProps<Dayjs[]>['onChange'] = (date, dateString) => {
      console.log(date, dateString);
    };
    const columns = [
      {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Auction day',
        dataIndex: 'auctionDay',
        key: 'auctionDay',
      },
      {
        title: 'Auction minutes',
        dataIndex: 'auctionMinutes',
        key: 'auctionMinutes',
      },
    ];
    

    return (
        <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical"  />
        <Menu theme="dark" defaultSelectedKeys={['myDocument']} mode="inline" items={items} />
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

        <Content className='contInfor' style={{ margin: '0 16px'}}>
          <div className='divTitle' style={{
            padding: 5,
            maxHeight: 60,
            background: colorBgContainer,
          }}>
            <h3>My Document</h3>
          </div>

          <div className='dibInfor' style={{padding: 15, minHeight: 485, background: colorBgContainer}}>
            <Row className='row1'>
              <div className='divSearch'>
                <div className='divFrom'>
                  <DatePicker onChange={onChange} placeholder='From'></DatePicker>
                </div>
                <div className='divTo'>
                  <DatePicker onChange={onChange} placeholder='To'></DatePicker>
                </div>
                <div className='productName'>
                  <Input placeholder="Product Name" />
                </div>
                <Button className='butSearch' type='text'>Search</Button>
              </div>
            </Row>

            <Row className='row2'>
              <Col className='colRow2'>
                <Row className='rowProduct'>
                  <div className='divTable'>
                    <Col className='colTable'>
                      <Table columns={columns}></Table>
                    </Col>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>
        </Content>

        <Footer>
        </Footer>
      </Layout>
    </Layout>
    )
}

export default MyDocument;