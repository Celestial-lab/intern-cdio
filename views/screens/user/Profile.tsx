'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Col, DatePicker, Form, Input, message, Modal, Radio, Row, type MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import {
  AppstoreOutlined,
  FileOutlined,
  HistoryOutlined,
  MailFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ClipLoader from 'react-spinners/ClipLoader';
import "@/views/style/Profile.css";
import { Footer } from 'antd/es/layout/layout';
import { getInforById } from '../../services/user/ProfileServices.js';
import moment from "moment";
import { MetaMaskInpageProvider } from "@metamask/providers";
import NavbarSetting from "@/views/components/NavbarSetting";
import { connectWallet } from '@/views/utils/connectWallet';
import { useProfile } from '@/views/hook/useProfile';
import { handleAddProfile } from '@/views/utils/user/compProfile/addProfile.js';
import { handleEditProfile } from '@/views/utils/author/compProfile/editProfile.js';
import { useAuthContent } from '@/views/store/context/AuthContext';
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const { Content, Sider } = Layout;

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
  const [isActive, setIsActive] = useState(true);
  const [timer, setTimer] = useState(600);
  const [profile, updateProfile] = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit');

  const [isLoading, setIsLoading] = useState(true);

  const { state } = useAuthContent();


  // chạy useEffect mối khi giá trị phụ thuộc (state) thay đổi
  // useEffect(() => {
  //   console.log('state: ', state);
  // }, [state]);

  const showAddModal = () => {
    setModalMode('add');
    setIsModalOpen(true);
  };

  const showEditModal = () => {
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    if (modalMode === 'add') {
      await handleAddProfile(form, updateProfile, profile);
      setIsModalOpen(false);
    } else {
      await handleEditProfile(form, updateProfile, profile);
      setIsModalOpen(false);
    }
  };

  const handleConnectWallet = async () => {
    await connectWallet(form, updateProfile, profile, state);
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await getInforById(userId);
          // console.log('response: ', response);
          const inforId = response.data.id;
          localStorage.setItem('inforId', inforId);
          const data = response.data;
          if (data) {
            updateProfile({
              email: data.email,
              fullname: data.fullname,
              dateofbirth: data.dateOfBirth,
              gender: data.gender ? 'Male' : 'Female',
              country: data.country,
              walletAddress: data.walletAddress,
            });
          } else {
            console.log('No profile data found for the given loginId');
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };
    fetchProfileData();
  }, []);

  // đếm ngược thời gian k tương tác với trang web để đăng nhập lại
  useEffect(() => {
    let countdown: string | number | NodeJS.Timeout | undefined;
    if (isActive) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            Modal.info({
              title: 'Bạn đã bị đăng xuất',
              content: (
                <p>Bạn đã không hoạt động trong 2 phút. Vui lòng đăng nhập lại</p>
              ),
              okText: 'Ok',
              onOk: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userEmail');
                window.location.href = '/user/signin';
              },
              closable: false,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(countdown);
    };
  }, [isActive]);
  const handleUserActivity = () => {
    setTimer(600);
    setIsActive(true);
  };
  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, []);

  return (

    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['profile']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <NavbarSetting />
        <Content className='contInfor' style={{ margin: '0 16px' }}>
          <div className='divTitle' style={{
            padding: 5,
            maxHeight: 60,
            background: colorBgContainer,
          }}><h3>Profile</h3></div>
          <div className='divInfor' style={{ padding: 15, minHeight: 485, background: colorBgContainer }}>
            <Row className='row1'>
              <Col className='colAvt' span={12}>
                <Row className='rowName'>
                  <Col span={3.5}>
                    <Avatar shape="circle" style={{ color: 'grey', background: '#e7e7e7' }} size={75} icon={<UserOutlined />} />
                  </Col>
                  <Col className='colName' span={20.5}>
                    <div className='divName'>
                      <p>
                        <span className='textName'>{profile.fullname}</span> <br />
                        <span className='textEmail'>{profile.email}</span>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col className='colEdit' span={12}>

                  <Button className='buttonEdit' type="text" onClick={showAddModal}>Add Infor</Button>
                  <Button className='buttonEdit' type="text" onClick={showEditModal}>Edit</Button>

                <Modal
                  title={modalMode === 'add' ? "Add Infor" : "Edit Profile"}
                  open={isModalOpen}
                  onOk={handleModalOk}
                  onCancel={handleCancelButton}
                  okText={modalMode === 'add' ? "Add" : "Edit"}
                  okButtonProps={{ className: 'modal-ok-button', type: 'text' }}
                  cancelButtonProps={{ type: 'text' }}
                >
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="fullName"
                      label="Full Name:"
                      initialValue={profile.fullname}
                    >
                      <Input placeholder={profile.fullname} />
                    </Form.Item>

                    <Form.Item
                      name="gender"
                      label="Gender"
                      initialValue={profile.gender === 'Male' ? true : false}
                      rules={[{ required: true, message: 'Please select gender!' }]}
                    >
                      <Radio.Group>
                        <Radio value={'Male'}>Male</Radio>
                        <Radio value={'Female'}>Female</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Row className="walletaddress" align="middle">
                      <Col span={18}>
                        <Form.Item
                          name="walletAddress"
                          label="Wallet Address:"
                          initialValue={profile.walletAddress}
                        >
                          <Input placeholder={profile.walletAddress} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Button className='butConnectInModal' type="text" onClick={handleConnectWallet}>
                          Connect Wallet
                        </Button>
                      </Col>
                    </Row>

                    <Form.Item
                      name="dateOfBirth"
                      label="Date of Birth"
                      initialValue={profile.dateofbirth ? moment(profile.dateofbirth) : null}
                      rules={[{ required: true, message: 'Please select date of birth!' }]}
                    >
                      <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                      name="country"
                      label="Country:"
                      initialValue={profile.country}
                    >
                      <Input placeholder={profile.country} />
                    </Form.Item>
                  </Form>
                </Modal>
              </Col>
            </Row>
            <Row className='row2'>
              <Col className='colInput1' span={12}>
                <div className='divInput1'>
                  <Form form={form} layout="vertical">
                    <Form.Item name="fullName" label="Full Name:">
                      <Input placeholder={profile.fullname} />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender:">
                      <Input placeholder={profile.gender} />
                    </Form.Item>
                    <Form.Item name="walletAddress" label="Wallet Address:" >
                      <Input placeholder={profile.walletAddress} />
                    </Form.Item>
                  </Form>
                </div>
              </Col>
              <Col className='colInput2' span={12}>
                <div className='divInput2'>
                  <Form form={form} layout="vertical">
                    <Form.Item name="dateOfBirth" label="Date of birth:">
                      <Input placeholder={profile.dateofbirth} />
                    </Form.Item>
                    <Form.Item name="country" label="Country:">
                      <Input placeholder={profile.country} />
                    </Form.Item>
                  </Form>
                  <Button className='connectWalletBut' type="text" onClick={handleConnectWallet}>Connect Wallet</Button>
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
                    <Avatar shape='circle' style={{ color: '#22C55E', background: '#e7e7e7' }} size={35} icon={<MailFilled />}></Avatar>
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
