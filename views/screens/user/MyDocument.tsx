'use client'

import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Input, Row, Table, Image, Modal } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { AppstoreOutlined, FileOutlined, HistoryOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import "@/views/style/MyDocument.css";
import { Footer } from 'antd/es/layout/layout';
import { getRegisterAuction } from '@/views/services/user/ProfileServices';
import NavbarSetting from '@/views/components/NavbarSetting';
import { useRouter } from 'next/navigation';
import { handleDeleteRegis } from '@/views/utils/user/compMyDocument/compDeleteRegis';
import { handleApprove } from '@/views/utils/user/compMyDocument/compApprove';
import { handleJoinLiveAuction } from '@/views/utils/user/compMyDocument/compJoinAuction';

const { Content, Sider } = Layout;

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
  const [deletingRegisId, setDeletingRegisId] = useState<number | null>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);


  useEffect(() => {
    const fetchRegisteredAuctions = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const register = await getRegisterAuction(userId);
        // in giá trị ra
        register.forEach((registration: any, index: number) => {
          console.log(`cuộc đấu giá ${index + 1}:`, registration);
          const registrationId = registration.registrationId;
          console.log('registration: ', registrationId);
        });
        if (register) {
          // Sử dụng map để chuyển đổi dữ liệu và log mảng đã chuyển đổi
          const mappedAuctions = register.map((auction: any) => ({
            registrationId: auction.registrationId,
            auctionIdLive: auction.id,
            name: auction.productName,
            auctionDay: new Date(auction.createdAt).toLocaleDateString(),
            auctionMinutes: Math.floor((auction.endTime - Date.now() / 1000) / 60),
            startingPrice: auction.startingPrice,
            imageUrl: auction.imageUrl,
          }));
          // Cập nhật state với mảng đã map
          setRegisteredAuctions(mappedAuctions);
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
      render: (_: any, record: { auctionIdLive: any, registrationId: any }) => (
        <div>
          <Button type="primary" onClick={() => JoinAuction(record.auctionIdLive, record.registrationId)}>Tham gia đấu giá</Button>
          <Button type="primary" onClick={() => handleDelete(record.registrationId)}>Huỷ đăng ký</Button>
        </div>
      ),
    },
    {
      title: 'Approve',
      key: 'action',
      render: (_: any, record: { key: any; }) => (
        <Button type="primary" onClick={() => handleApproveAuction(record.key)}>Approve</Button>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    setDeletingRegisId(id);
    setConfirmDeleteVisible(true);
  };

  const confirmDeleteProduct = async () => {
    if (deletingRegisId !== null) {
      await handleDeleteRegis(deletingRegisId, setRegisteredAuctions);
      setDeletingRegisId(null);
      setConfirmDeleteVisible(false);
    }
  };

  const router = useRouter();

  const handleApproveAuction = async () => {
    await handleApprove();
  }

  const JoinAuction = async (auctionIdLive: any, registrationId: any) => {
    await handleJoinLiveAuction(auctionIdLive, registrationId, router)
  }

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
                      <Table columns={columns} dataSource={registeredAuctions} rowKey="key" />
                    </Col>
                  </div>
                </Row>
              </Col>
            </Row>
            <Modal
              title="Confirm Delete"
              visible={confirmDeleteVisible}
              onCancel={() => setConfirmDeleteVisible(false)}
              onOk={confirmDeleteProduct}
              okText="Yes"
              cancelText="No"
            >
              <p>Bạn có chắc chắn muốn huỷ đăng ký cuộc đấu giá này không?</p>
            </Modal>

          </div>
        </Content>

        <Footer>
        </Footer>
      </Layout>
    </Layout>
  )
}
export default MyDocument;
