'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Col, DatePicker, Input, Row, Table, Image } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { AppstoreOutlined, BellOutlined, DollarOutlined, FileOutlined, HistoryOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import "@/views/style/MyDocument.css"; 
import { Footer } from 'antd/es/layout/layout';
import { Approve, getRegisterAuction } from '@/views/services/user/ProfileServices';
import NavbarSI from '@/views/components/NavbarSI';
import NavbarSetting from '@/views/components/NavbarSetting';
import { ethers } from 'ethers';

const { Header, Content, Sider } = Layout;


function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, href?: string) {
  return {
    key,
    icon,
    label: <a href={href}>{label}</a>,
  };
}

const items = [
  getItem('Profile', 'profile', <AppstoreOutlined />, '/user/settings/Profile'),
  getItem('Cart', 'cart', <ShoppingCartOutlined />, '/user/settings/Cart'),
  getItem('Auction History', 'auctionHistory', <HistoryOutlined />, '/user/settings/AuctionHistory'),
  getItem('My Document', 'myDocument', <FileOutlined />, '/user/settings/MyDocument'),
];

const MyDocument = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken(); 
  const [registeredAuctions, setRegisteredAuctions] = useState([]);

 
  useEffect(() => {
    const fetchRegisteredAuctions = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const auctions = await getRegisterAuction(userId);
        console.log('auction nè: ', auctions);
        if (auctions) {
          setRegisteredAuctions(auctions.map((auction: { id: any; productName: any; createdAt: string | number | Date; endTime: number; startingPrice: any; imageUrl: any; }) => ({
            key: auction.id,
            name: auction.productName,
            auctionDay: new Date(auction.createdAt).toLocaleDateString(),
            auctionMinutes: Math.floor((auction.endTime - Date.now() / 1000) / 60), 
            startingPrice: auction.startingPrice,
            imageUrl: auction.imageUrl,
          })));
        } else {
          console.error('Không tìm thấy cuộc đấu giá nào.');
        }
      } else {
        console.error('Không tìm thấy userId trong localStorage.'); 
      }
    };
    fetchRegisteredAuctions();
  }, []);

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string | undefined) => <Image width={100} src={imageUrl} alt="Product" />,
    },
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
    {
      title: 'Starting Price',
      dataIndex: 'startingPrice',
      key: 'startingPrice',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { key: any; }) => (
        <Button type="primary" onClick={() => handleJoinAuction(record.key)}>Tham gia đấu giá</Button>
      ),
    },
    {
      title: 'Approve',
      key: 'action',
      render: (_: any, record: { key: any; }) => (
        <Button type="primary" onClick={() => handleApprove(record.key)}>Approve</Button>
      ),
    },
  ];

  const handleJoinAuction = (auctionId: any) => {
    console.log(`Tham gia đấu giá cho cuộc đấu giá ID: ${auctionId}`);

    // window.location.href = '/user/approve';
  };

  const handleApprove = async (key: any) => {
    try {
        const userAddress = localStorage.getItem('userAddress');
        if (!userAddress) {
            alert("Không tìm thấy địa chỉ ví của người dùng trong localStorage.");
            return;
        }
        if (!window.ethereum) {
            alert("Vui lòng cài đặt MetaMask!");
            return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tokenAddress = "0x463267b530182e5C3Aed5441cC22e76A77d4B51C";
        const spenderAddress = "0xD33aF4BEb2C050b36d146D84DDA6A9a0221e254c"; 
        const approveAmount = ethers.parseUnits("1000", 18);

        const tokenABI = [
            "function approve(address spender, uint256 amount) public returns (bool)"
        ];
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        console.log("Hợp đồng token đã được tạo:", tokenContract); 

        // Gửi giao dịch approve
        const transaction = await tokenContract.approve(spenderAddress, approveAmount);
        console.log("Đang thực hiện approve, đợi xác nhận giao dịch...");
        await transaction.wait();
        console.log("Giao dịch approve hoàn tất:", transaction);


        alert("Approve thành công!");
        
        // window.location.href = '/user/LiveAuction';

    } catch (error) {
        console.error("Lỗi khi thực hiện approve:", error);
        alert("Đã xảy ra lỗi khi thực hiện approve: " + (error));
    }
};

  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['myDocument']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <NavbarSetting />

        <Content className='contInfor' style={{ margin: '0 16px' }}>
          <div className='divTitle' style={{
            padding: 5,
            maxHeight: 60,
            background: colorBgContainer,
          }}>
            <h3>My Document</h3>
          </div>

          <div className='dibInfor' style={{ padding: 15, minHeight: 485, background: colorBgContainer }}>
            <Row className='row1'>
              <div className='divSearch'>
                <div className='divFrom'>
                  <DatePicker placeholder='From' />
                </div>
                <div className='divTo'>
                  <DatePicker placeholder='To' />
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
                      <Table columns={columns} dataSource={registeredAuctions} rowKey="key" /> {/* Cập nhật dataSource */}
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
