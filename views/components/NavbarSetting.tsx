'use client'

import { BellOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import "@/views/style/NavbarSetting.css";
import moment from 'moment';
import { getProfileByEmail } from '../services/author/AuthorServices';

export default function NavbarSetting() {
  const formattedDate = moment().format('ddd, DD MMMM YYYY');
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    nickname: '',
  });
  const [walletBalance, setWalletBalance] = useState('0');

  useEffect(() => {
    const storedBalance = localStorage.getItem('walletBalance');
    if (storedBalance) {
      setWalletBalance(storedBalance);
    }
  }, []);

  useEffect(() => {
    const fetchNameAuthor = async () => {
      const email = localStorage.getItem('authorEmail');
      if (email) {
        try {
          const response = await getProfileByEmail(email);
          const data = response.data;
          if (data) {
            setProfile({
              nickname: data.nickname,
            });
          } else {
            console.log('No UserName found for the given email');
          }
        } catch (error) {
          setError('Failed to fetch UserName');
          console.error('Failed to fetch UserName:', error);
        }
      }
    };
    fetchNameAuthor();
  }, []);

  return (
    <div>
      <Row className='row'>
        <Col className='col1' span={12}>
          <p style={{ fontWeight: 750 }}>Hello, {profile.nickname}</p>
          <p style={{ color: '#ADA7A7' }}>{formattedDate}</p>
        </Col>
        <Col className='col2' span={12}>
          <Row className='headerRight'>
            <div className='iconBell'>
              <BellOutlined style={{ color: 'grey' }} />
            </div>
            <div className='iconDollar'>
              <DollarOutlined style={{ color: 'grey' }} />
              <div className='showTotalMoney'>{walletBalance} CELE</div>
            </div>
            <div className='avt1'>
              <Avatar
                shape="square"
                style={{ color: 'grey', background: 'white' }}
                size={40}
                icon={<UserOutlined />}
              />
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
