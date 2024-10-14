'use client';

import React, { useState } from 'react';
import { Card, Col, Row, Typography, Pagination, Button, Menu, Dropdown, Select } from 'antd';
import Navbar from "@/views/components/Navbar";
import { DownOutlined } from '@ant-design/icons';
import FooterNavbar from "@/views/components/FooterNavbar";
import "@/views/style/Product.css";
import { useRouter } from 'next/navigation';
import { products } from "@/views/screens/Product/Data";
import FooterAll from '@/views/components/Footer.js';

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

      <section class="product">

        <div className="show-product">
          <div className="tableGif">

            <div class="title-table">
              <p class="showing">
                Showing {startIndex + 1} - {Math.min(endIndex, products.length)} of {products.length} items
              </p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dropdown overlay={menu}>
                  <Button style={{
                    background: 'white',
                    color: 'black',
                    borderRadius: '4px',
                    marginRight: '15px',
                    fontFamily: 'var(--space-grotesk-fonts)'
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
                    marginRight: '15px',
                    fontFamily: 'var(--space-grotesk-fonts)'
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
                  <img alt="example" src={item.imageUrl} className="card-img-top" />
                  {item.isNew && (
                    <div class="status-new">
                      New
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{item.productName}</h5>
                    <p className="card-text">{item.price}</p>
                    <button
                      className="btn btn-success"
                      onClick={() => handleRegisterClick(item.id)}
                    >
                      Register
                    </button>
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
}

export default Product;
