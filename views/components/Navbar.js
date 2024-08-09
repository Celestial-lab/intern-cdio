'use client'
import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { HomeOutlined, InfoCircleOutlined, ContactsOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import "@/views/style/Navbar.css";

const { Header } = Layout;

const Navbar = () => {

  const loginMenu = (
    <div className="login-dropdown">
      <button
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/user/login';
        }}
      >
        Login for User
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/author/login';
        }}
      >
        Login for Author
      </button>
    </div>
  );

  const signupMenu = (
    <div className="login-dropdown">
      <button
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/user/login';
        }}
      >
        Sign Up for User
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/author/login';
        }}
      >
        Sign Up for Author
      </button>
    </div>
  );

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
      <div className="login">
        <Dropdown overlay={loginMenu} trigger={['hover']} placement="bottomRight">
          <button>
            Login
          </button>
        </Dropdown>
        <Dropdown overlay={signupMenu} trigger={['hover']}>
          <button>
            Sign Up
          </button>
        </Dropdown>
      </div>
    </Header>
  );
}

export default Navbar;
