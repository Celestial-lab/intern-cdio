'use client';

import React, { useState } from 'react';
import { Card, Col, Row, Typography, Pagination, Button, Menu, Dropdown, Select } from 'antd';
import Navbar from "@/views/components/Navbar";
import { DownOutlined } from '@ant-design/icons';
import FooterNavbar from "@/views/components/FooterNavbar";
import "@/views/style/Product.css";
import { useRouter } from 'next/navigation'; 
import {products} from "@/views/screens/Product/Data";

const { Title } = Typography;
const { Option } = Select;

const Product = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [sortedProducts, setSortedProducts] = useState(products);
  const router = useRouter();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedProducts.slice(startIndex, endIndex);

  const handleMenuClick = (e) => {
    const key = e.key;
    const sorted = [...products].sort((a, b) => {
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

  const handleRegisterClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  return (
    <>
      <Navbar />

      <img src="Image8.png" className="img-fluid" alt="banner" />

      <div className="tableGif" style={{ padding: '30px 15px' }}>
        <div style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: '#22C55E', 
          padding: '13px 20px', 
          borderRadius: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <p style={{ 
            color: 'white',
            flex: 1,
            marginLeft: '40px',
            fontSize: '16px',
          }}>
            Showing {startIndex + 1} - {Math.min(endIndex, products.length)} of {products.length} items
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown overlay={menu}>
              <Button style={{ 
                background: 'white', 
                color: '#22C55E', 
                borderColor: '#22C55E',
                borderRadius: '4px', 
                marginRight: '15px' 
              }}>
                Sort by <DownOutlined />
              </Button>
            </Dropdown>
            <Select 
              defaultValue={16} 
              style={{ 
                width: 120, 
                borderRadius: '4px', 
                borderColor: '#22C55E', 
                marginRight: '15px'
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

        <Row gutter={[32, 32]} justify="center" align="middle" style={{ maxWidth: '93%', margin: '0 auto' }}>
          {currentItems.map((item) => (
            <Col span={6} className="gif" key={item.id} style={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                className="hover-card"
                hoverable
                style={{ width: 240, position: 'relative' }}
                cover={
                  <div className="image-container">
                    <img alt="example" src={item.imageUrl} className="card-image" />
                    {item.isNew && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: '#ff4d4f',
                        color: 'white',
                        padding: '5px 10px',
                        borderBottomLeftRadius: '8px'
                      }}>
                        New
                      </div>
                    )}
                    <Button 
                      className="hover-button custom-button" 
                      style={{ background: '#22C55E', color: 'white', border: 'white' }} 
                      onClick={() => handleRegisterClick(item.id)}
                    >
                      Register
                    </Button>
                  </div>
                }
              >
                <Card.Meta
                  title={<Title level={5}>{item.productName}</Title>}
                  description={<p>{item.price}</p>}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={sortedProducts.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <FooterNavbar />
    </>
  );
}

export default Product;
