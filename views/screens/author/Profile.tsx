'use client'

import React, { useEffect, useState } from 'react'
import { Avatar, Button, Col, DatePicker, Form, Input, message, Modal, Radio, Row, type MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import {
  BarChartOutlined,
  MailFilled,
  ProductOutlined,
  UserOutlined,
} from '@ant-design/icons';
import "@/views/style/ProfileAuthor.css";
import { Footer } from 'antd/es/layout/layout';
import { editProfileById, getProfileByEmail } from '../../services/author/AuthorServices';
import moment from "moment";
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from "@metamask/providers";
import NavbarSetting from '@/views/components/NavbarSetting';
import { addCreateInfor, editInforById, getInforById } from '@/views/services/user/ProfileServices';


const { Header, Content, Sider } = Layout;

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

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


export default function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const [form] = Form.useForm();

  const [profile, setProfile] = useState({
    email: '',
    fullname: '',
    dateofbirth: '',
    gender: '',
    country: '',
    walletAddress: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOkButton = async () => {
    try {
      const values = await form.validateFields();
      const updatedProfile = {
        fullname: values.fullname || profile.fullname,
        gender: values.gender,
        walletaddress: values.walletaddress,
        dateofbirth: values.dateofbirth ? values.dateofbirth.format("YYYY-MM-DD") : profile.dateofbirth,
        country: values.country || profile.country,
      };
      const response = await editProfileById(profile.id, updatedProfile);
      if (response) {
        setProfile({ ...profile, ...updatedProfile, gender: values.gender });
        message.success('Profile updated successfully!');
      } else {
        message.error('Failed to update profile!');
      }

      setIsModalOpen(false);

    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile!');
    }
  }
  const handleCancelButton = () => {
    setIsModalOpen(false)
  }

  const [error, setError] = useState<string | null>(null);


  const connectWallet1 = async () => {
    try {
      if (!window.ethereum) {
        message.error('MetaMask is not installed!');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await (await signer).getAddress();
      const balance = await provider.getBalance(walletAddress);
      const balanceInEth = ethers.formatEther(balance);
      const formattedBalance = parseFloat(balanceInEth).toFixed(3);

      localStorage.setItem('authorBalance', formattedBalance);
      localStorage.setItem('authorAddress', walletAddress);

      form.setFieldsValue({ walletaddress: walletAddress });
      const updatedProfile = { ...profile, walletaddress: walletAddress };

      const response = await editProfileById(profile.id, updatedProfile);
      if (response) {
        setProfile(updatedProfile);
        message.success('Wallet connected and updated successfully!');

        localStorage.setItem('walletBalance', formattedBalance);

        console.log('balance: ', localStorage.getItem('walletBalance'));

        // const showTotalMoneyDiv = document.querySelector('.showTotalMoney');
        // if (showTotalMoneyDiv) {
        //   showTotalMoneyDiv.textContent = `${formattedBalance} CELE`;
        // }
      } else {
        message.error('Failed to update wallet address!');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      message.error('Failed to connect wallet!');
    }
  };

  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit');

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
      await handleAddButton(); // Gọi hàm khi nhấn "Add"
    } else {
      await handleEditInfor(); // Gọi hàm khi nhấn "Edit"
    }
  };





  useEffect(() => {
    const fetchProfileData = async () => {
      const authorId = localStorage.getItem('authorId');
      if (authorId) {
        try {
          const response = await getInforById(authorId);
          const inforId = response.data.id;
          localStorage.setItem('inforId', inforId);

          console.log('response sau get: ', response);

          const data = response.data;
          if (data) {
            setProfile({
              email: data.email,
              fullname: data.fullname,
              dateofbirth: data.dateOfBirth,
              gender: data.gender ? 'Male' : 'Female',
              country: data.country,
              walletAddress: data.walletAddress,
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
    checkAuth();
    fetchProfileData();
  }, []);

  const handleAddButton = async () => {
    try {
      const values = await form.validateFields();

      const authorId = localStorage.getItem('authorId');

      console.log('values trước khi chạy updated: ', values);
      const addInfor = {
        fullname: values.fullName,
        dateOfBirth: values.dateOfBirth.toISOString(),
        gender: values.gender,
        country: values.country,
        walletAddress: values.walletAddress,
        loginId: authorId,
      };
      const response = await addCreateInfor(addInfor);
      console.log('response bên frontend: ', response);
      if (response) {
        setProfile({ ...profile, ...addInfor, gender: values.gender });
        message.success('Profile updated successfully!');
      } else {
        message.error('Failed to update profile!');
      };
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile!');
    }
  }

  const handleEditInfor = async () => {
    try {
      const values = await form.validateFields();

      const inforId = localStorage.getItem('inforId');

      const updatedProfile = {
        fullname: values.fullName,
        dateofbirth: values.dateOfBirth,
        gender: values.gender,
        country: values.country,
        walletAddress: values.walletAddress,
      };

      console.log('values sau khi nhập vào updated: ', updatedProfile);

      const response = await editInforById(inforId, updatedProfile);

      console.log('response trả về sau edit: ', response);

      if (response) {
        setProfile(updatedProfile);
        message.success('Profile updated successfully!');
      } else {
        message.error('Failed to update profile!');
      }

      // setIsModalOpen(false);

    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile!');
    }
  }

  // Hàm kết nối ví MetaMask
  const connectWallet = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        message.error("Vui lòng đăng nhập lại");
        setTimeout(() => {
          window.location.href = '/user/signin';
        }, 1500);
        return;
      }
  
      if (!window.ethereum) {
        message.error('MetaMask is not installed!');
        return;
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const balance = await provider.getBalance(walletAddress);
      const balanceInEth = ethers.formatEther(balance);
      const formattedBalance = parseFloat(balanceInEth).toFixed(3);
  
      // Lưu số dư vào localStorage
      localStorage.setItem('userBalance', formattedBalance);
      localStorage.setItem('userAddress', walletAddress);

  
      // Cập nhật trường walletAddress trong form
  
      const inforId = localStorage.getItem('inforId');
  
      if (!inforId) {
        // Nếu không có inforId, chỉ cập nhật trường walletAddress trong form
        message.info('Vui lòng thêm thông tin cá nhân trước khi kết nối ví.');
        // Thực hiện hành động để thêm thông tin nếu cần
        // Có thể mở modal hoặc thực hiện một hành động nào đó

        form.setFieldsValue({
          walletAddress: walletAddress,
        });

      } else {
        // Nếu đã có inforId, cập nhật profile với địa chỉ ví
        const updatedProfile = {
          ...profile,
          walletAddress: walletAddress,
        };
  
        console.log('updatedProfile: ', updatedProfile);
    
        const response = await editInforById(inforId, updatedProfile);
  
        console.log('response sau connect: ', response);
    
        if (response) {
          setProfile(updatedProfile);
          message.success('Wallet connected and updated successfully!');
  
          // Cập nhật số tiền hiển thị
          const showTotalMoneyDiv = document.querySelector('.showTotalMoney');
          if (showTotalMoneyDiv) {
            showTotalMoneyDiv.textContent = `${formattedBalance} $`;
          }
        } else {
          message.error('Failed to update wallet address!');
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      message.error('Failed to connect wallet!');
    }
  };


  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      message.error("Vui lòng đăng nhập lại");
      setTimeout(() => {
        window.location.href = '/user/signin';
      }, 1500);
    } else {
      console.log("Token hợp lệ, tiếp tục truy cập trang");
    }
  };


  // đếm ngược thời gian k tương tác với trang web để đăng nhập lại
  const [isActive, setIsActive] = useState(true);
  const [timer, setTimer] = useState(600);
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

  // useEffect(() => {
  //   const showTotalMoneyDiv = document.querySelector('.showTotalMoney');
  //   if (showTotalMoneyDiv) {
  //     showTotalMoneyDiv.textContent = '0 CELE';
  //   }
  // }, []);

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
                        <Button className='butConnectInModal' type="text" onClick={connectWallet}>
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
                  <Button className='connectWalletBut' type="text" onClick={connectWallet}>Connect Wallet</Button>
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
  )
}
