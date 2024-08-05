'use client'
import React from 'react';
import { Layout, Menu, Button, Image } from 'antd';
import { HomeOutlined, InfoCircleOutlined, ContactsOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import "@/views/style/Navbar.css";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header className="header">
      <div className="logo">
         <img src="/CeLestial-wbg.png" alt="Logo" className="img-fluid" width="150" height="100" /> 
      </div>
      <Menu mode="horizontal" className="menu">
        <Menu.Item key="home">
          <Link href="/products">Product</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link href="/Blogs/Technology">Blogs</Link>
        </Menu.Item>
        <Menu.Item key="contact">
          <Link href="/contact">Auction results</Link>
        </Menu.Item>
      </Menu>
      <div className="connectwallet">
        <button
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/connect-wallet';
          }}
        >
          Connect Wallet
        </button>
      </div>
    </Header>
  );
}

export default Navbar;
