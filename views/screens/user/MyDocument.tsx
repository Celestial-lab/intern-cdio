'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Col, DatePicker, Input, Row, Table, Image, message } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { AppstoreOutlined, BellOutlined, DollarOutlined, FileOutlined, HistoryOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import "@/views/style/MyDocument.css";
import { Footer } from 'antd/es/layout/layout';
import { Approve, checkAllowance, deleteRegisterAuction, getRegisterAuction } from '@/views/services/user/ProfileServices';
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
        const register = await getRegisterAuction(userId);
        

        //in giá trị ra
        register.forEach((registration: any, index: number) => {
          console.log(`cuộc đấu giá ${index + 1}:`, registration);

          const registrationId = registration.registrationId;

          // console.log('registration: ', registrationId)
        });

        if (register) {
          setRegisteredAuctions(register.map((auction: any) => ({
            registrationId: auction.registrationId,
            auctionId: auction.id,
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

  useEffect(() => {
    console.log('Giá trị registeredAuctions sau khi cập nhật:', registeredAuctions);
  }, [registeredAuctions]);

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
      render: (_: any, record: { registrationId: any }) => (
        <div>
          <Button type="primary" onClick={() => handleJoinAuction(record.registrationId)}>Tham gia đấu giá</Button>
          <Button type="danger" onClick={() => handleDeleteRegisterAuction(record.registrationId)}>Huỷ đăng ký</Button>
        </div>
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

  

  const handleDeleteRegisterAuction = async (registrationId: any) => {
    try {
      const response = await deleteRegisterAuction(registrationId);
      console.log('Response trả về sau khi gọi API: ', response);
  
      if (response) {
        setRegisteredAuctions((prevAuctions) => {
          const updatedAuctions = prevAuctions.filter(
            (auction) => auction.registrationId !== registrationId
          );
          console.log('Đã xóa sản phẩm đăng ký:', registrationId);
          console.log('Auction sau khi cập nhật:', updatedAuctions);
          message.success('Đã xóa sản phẩm đăng ký');
          return updatedAuctions;
        });
      } else {
        console.error('Xóa sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi xóa sản phẩm:', error);
    }
  };

  const handleApprove = async (key: any) => {
    try {
      let userAddress = localStorage.getItem('userAddress');
      if (!userAddress) {
        alert("Bạn chưa thêm thông tin và kết nối ví. Để thực hiện chức năng Approve, hãy thêm thông tin và kết nối ví");
        if (!window.ethereum) {
          alert("Vui lòng cài đặt MetaMask!");
          return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = localStorage.getItem('userAddress');
        if (!userAddress) {
          // alert("Không thể lấy địa chỉ ví của người dùng. Hãy thử lại.");
          return;
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Địa chỉ token và số lượng approve
      const tokenAddress = "0x65162C4d8dd16594546338C9C637105C031288cF";
      const spenderAddress = "0xDeAFB1df5c2738a2106D28fCcF12e97F76Ef3BD9";
      const approveAmount = ethers.parseUnits("10", 18);

      const tokenABI = [
        "function approve(address spender, uint256 amount) public returns (bool)"
      ];

      // Khởi tạo đối tượng hợp đồng token
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      console.log("Hợp đồng token đã được tạo:", tokenContract);

      // Gửi giao dịch approve
      const transaction = await tokenContract.approve(spenderAddress, approveAmount);
      console.log("Đang thực hiện approve, đợi xác nhận giao dịch...");
      await transaction.wait();
      console.log("Giao dịch approve hoàn tất:", transaction);
      alert("Approve thành công!");

    } catch (error) {
      console.error("Lỗi khi thực hiện approve:", error);
      alert("Đã xảy ra lỗi khi thực hiện approve: " + error);
    }
};


  const handleJoinAuction = async (registrationId: any) => {
    console.log(`Tham gia đấu giá cho cuộc đấu giá ID: ${registrationId}`);

    if (!localStorage.getItem('userAddress') && !localStorage.getItem('inforId')) {
      message.error('Hãy cập nhật thông tin cá nhân đầy đủ để tham gia đấu giá')
    } else if (!localStorage.getItem('userAddress') && localStorage.getItem('inforId')) {
      message.error('Hãy kết nối ví lại để tham gia đấu giá')
    } else if (localStorage.getItem('userAddress') && localStorage.getItem('inforId')) {

      const userAddress = localStorage.getItem('userAddress');
      const spenderAddress = "0xDeAFB1df5c2738a2106D28fCcF12e97F76Ef3BD9";

      const response = await checkAllowance(spenderAddress, userAddress);

      console.log('allowance trả về', response.allowance);

      if (response.allowance == 0) {
        message.error('hãy Approve trước khi tham gia đấu giá')
      } else {
        message.success('vô nè')
        window.location.href = '/user/LiveAuction';
      }
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
