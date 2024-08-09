'use client'

import React, { useState } from 'react'
import { Avatar, Button, Col, DatePicker, Row, Table, type MenuProps } from 'antd';
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
import "@/views/style/AuctionHistory.css";
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


const AuctionHistory = () => {
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
        title: 'Auction price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Time of payment',
        dataIndex: 'Time of payment',
        key: 'Time of payment',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical"  />
        <Menu theme="dark" defaultSelectedKeys={['auctionHistory']} mode="inline" items={items} />
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
            <h3>Auction History</h3>
          </div>

          <div className='dibInfor' style={{padding: 15, minHeight: 485, background: colorBgContainer}}>
            <Row className='row1'>
              <div className='divSearch'>
                <div className='divFrom'>
                  <DatePicker onChange={onChange} placeholder='Auction period from'></DatePicker>
                </div>
                <div className='divTo'>
                  <DatePicker onChange={onChange} placeholder='To'></DatePicker>
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

export default AuctionHistory;