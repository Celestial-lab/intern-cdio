'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Pagination, Button, Menu, Dropdown, Select } from 'antd';
import Navbar from "@/views/components/Navbar";
import NavbarAfter from "@/views/components/NavbarAfter";
import { DownOutlined } from '@ant-design/icons';
import "@/views/style/Product.css";
import FooterAll from '@/views/components/Footer.js';
import { getAuction } from '@/views/services/AuctionServices';

const { Title } = Typography;
const { Option } = Select;

const ProductPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedProducts.slice(startIndex, endIndex);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionData = await getAuction();
        console.log('Dữ liệu trả về từ API:', auctionData);
        if (auctionData && Array.isArray(auctionData) && auctionData.length > 0) {
          setSortedProducts(auctionData);
        } else {
          console.error("API không trả về dữ liệu hợp lệ.");
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  

  const handleMenuClick = (e) => {
    const key = e.key;
    const sorted = [...sortedProducts].sort((a, b) => {
      if (key === 'asc') {
        return a.productName.localeCompare(b.productName);
      } else if (key === 'desc') {
        return b.productName.localeCompare(a.productName);
      }
      return 0;
    });
    setSortedProducts(sorted);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="asc">Sort A-Z</Menu.Item>
      <Menu.Item key="desc">Sort Z-A</Menu.Item>
    </Menu>
  );


  const handleRegisterClick = (auctionId) => {
    console.log('Thông tin sản phẩm:', auctionId);

    localStorage.setItem('auctionId', auctionId);

    window.location.href = `/products/${auctionId}`;
  };

  if (loading) {
    return <p>Đang tải dữ liệu đấu giá...</p>;
  }

  return (
    <>
      {isLoggedIn ? <NavbarAfter /> : <Navbar />}

      <section className="product">
        <div className="show-product">
          <div className="tableGif">
            <div className="title-table">
              <p className="showing">
                Showing {startIndex + 1} - {Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length} items
              </p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dropdown overlay={menu}>
                  <Button
                    style={{
                      background: 'white',
                      color: 'black',
                      borderRadius: '4px',
                      marginRight: '15px',
                      fontFamily: 'var(--space-grotesk-fonts)',
                    }}
                  >
                    Sort by <DownOutlined />
                  </Button>
                </Dropdown>
                <Select
                  defaultValue={16}
                  style={{
                    width: 120,
                    borderRadius: '4px',
                    borderColor: '#22C55E',
                    marginRight: '15px',
                    fontFamily: 'var(--space-grotesk-fonts)',
                  }}
                  onChange={handleItemsPerPageChange}
                >
                  <Option value={8}>8 per page</Option>
                  <Option value={16}>16 per page</Option>
                  <Option value={32}>32 per page</Option>
                  <Option value={64}>64 per page</Option>
                </Select>
              </div>
            </div>

            <div className="row" style={{ maxWidth: '93%', margin: '0 auto' }}>
              {currentItems.map((item) => (
                <div className="col-3" key={item.id} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div className="card" style={{ width: '18rem', position: 'relative' }}>
                    <img alt={item.productName} src={item.imageUrl} className="card-img-top" />
                    <div className="card-body">
                      <h5 className="card-title">{item.productName}</h5>
                      <p className="card-text">{item.description}</p>
                      <p className="card-text">Price: {item.startingPrice}</p>
                      <button className="btn btn-success" onClick={() => handleRegisterClick(item.id)}>Register</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={sortedProducts.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </section>

      <FooterAll />
    </>
  );
};

export default ProductPage;
