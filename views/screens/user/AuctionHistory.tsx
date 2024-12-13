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
import "@/views/style/auctionHistory.css";
import { Footer } from 'antd/es/layout/layout';
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import NavbarSetting from '@/views/components/NavbarSetting';

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
  getItem('Auction History', 'auctionHistory', <HistoryOutlined />, '/user/settings/AuctionHistory'),
  getItem('Registered Auctions', 'myDocument', <FileOutlined />, '/user/settings/MyDocument'),
];


const AuctionHistory = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
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
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['auctionHistory']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <NavbarSetting />

        <Content className='contInfor' style={{ margin: '0 16px' }}>
          <div className='divTitle' style={{
            padding: 5,
            maxHeight: 60,
            background: colorBgContainer,
          }}>
            <h3 className='titFromDiv'>Auction History</h3>
          </div>

          <div className='dibInfor' style={{ padding: 15, minHeight: 485, background: colorBgContainer }}>
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
      </Layout>
    </Layout>
  )
}

export default AuctionHistory;