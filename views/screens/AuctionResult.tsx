'use client'

import React, { useEffect, useState } from "react";
import { Col, DatePicker, Row, Space, Button, Collapse, Table } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import "@/views/style/AuctionResult.css";
import { CaretRightOutlined } from '@ant-design/icons';
import { showAuctionResult } from '@/views/services/AuctionServices';
import FooterAll from "../components/Footer";
import NavbarAfter from "../components/NavbarAfter";

const AuctionResults = () => {
  const [auctionData, setAuctionData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm gọi API
  const getAuctionResult = async () => {
    const response = await showAuctionResult();
    if (response.success) {
      const groupedData = response.data.reduce((acc, item) => {
        const date = new Date(item.endTime).toLocaleDateString(); // Lấy ngày dạng YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
      setAuctionData(groupedData);
    }
  };

  useEffect(() => {
    getAuctionResult();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoggedIn(false);
      const userConfirmed = window.confirm("Bạn chưa đăng nhập, hãy đăng nhập!");
      if (userConfirmed) {
        window.location.href = '/user/signin';
      }
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  // Cấu hình bảng
  const columns = [
    {
      title: "Product's Name",
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: "Author's Name",
      dataIndex: 'winnerFullName',
      key: 'winnerFullName',
    },
    {
      title: 'Winning auction price',
      dataIndex: 'highestBid',
      key: 'highestBid',
    },
  ];

  return (
    <>
      {isLoggedIn ? <NavbarAfter /> : <Navbar />}
      <section className='auction-result'>
        <div className="container py-5">
          <h1 className="titleStyle">Auction Results</h1>
          <Collapse
            bordered={false}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: '#f5f5f5' }}
          >
            {Object.keys(auctionData).map(date => (
              <Collapse.Panel
                key={date}
                header={`Auction results on ${date}`}
                style={{ marginBottom: 24, background: '#fff', borderRadius: 6 }}
              >
                <Table
                  columns={columns}
                  dataSource={auctionData[date].map((item, index) => ({
                    key: index,
                    ...item,
                  }))}
                  pagination={false}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      </section>
      <FooterAll />
    </>
  );
};

export default AuctionResults;
