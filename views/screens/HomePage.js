'use client'

import React from "react";
import { Row, Col, Card, Button , Typography  } from "antd";
import 'bootstrap/dist/css/bootstrap.min.css';
import {InfoCircleOutlined} from '@ant-design/icons';
import "@/views/style/Title.css";
import Navbar from "../components/Navbar";
import FooterNavbar from "../components/FooterNavbar";
import Link from "next/link";


const { Text, Paragraph } = Typography;

const Home = () => {
       return(  
        <>
        <Navbar />

       <div className="containerTitle">
        <div className="title">
          <Row>
            <Col span={12}>
            <h3>Celestial</h3>
              <p>Our auction website is an online platform that allows buying and selling 
                goods and services through auction. Sellers post products with starting prices, 
                buyers place bids within the specified time. Products are clearly classified, 
                making it easy to search. This is a competitive and vibrant trading environment, 
                bringing many opportunities to both buyers and sellers.
              </p>
              <Link href="/connect-wallet" passHref>
      <button
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/connect-wallet';
        }}
        style={{
          backgroundColor: '#22C55E',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          height : '38px',
          width : '110px'
        }}
      >
        Connect Wallet
      </button>
    </Link>
            </Col>
            <Col span={12}>
            <Card className="image">
            <img src="/CeLestial-wbg.png" 
         class="img-fluid" 
           width="200px" height="auto" /> 
  
            </Card>
            </Col>
          </Row>
        </div>
        <div className="tableContainer">
          <h2>Gain more insight into how people use your</h2>
          <p>With the ability to integrate Blockchain, our auction website can secure information</p>
          <div className="table">
          <Row gutter={[24, 16]}>
            <Col span={8}>
            <img src="/Image7.png" 
            class="img-fluid" 
            width="70" height="70" />
            <h4>Buy and sell easily, reputable auction</h4>
            <p>We are committed to bringing you the simplest and most convenient online shopping experience</p>
            </Col>
            <Col span={8}>
            <img src="/Image6.png" 
            class="img-fluid" 
            width="70" height="70" />
            <h4>Smart transactions, top reputation</h4>
            <p>With a reputable and top-notch security platform, you can feel completely secure when making transactions</p>
            </Col>
            <Col span={8}>
            <img src="/Image3.png" 
            class="img-fluid" 
            width="70" height="70" />
            <h4>Prestige top priority</h4>
            <p>Our reputation is a solid foundation that helps you feel completely secure when participating in online buying, selling and auctions</p>
            </Col>
            
            <Col span={12}>
            <img src="/Image4.png" 
            class="img-fluid" 
            width="70" height="70" />
            <h4>Real value, real experience</h4>
            <p>We guarantee that every product matches the description and quality</p>
            </Col>
            <Col span={12}>
            <img src="/Image5.png" 
            class="img-fluid" 
            width="70" height="70" />
            <h4>Public auction, absolutely confidential</h4>
            <p>With the combination of openness and security, you can participate in online auctions and shopping with complete peace of mind</p>
            </Col>
          </Row>
          </div>
       </div>
       <div className="slide">
        <div className="slideTitle" >
        <h2>Flexible pricing plan for your startup</h2>
        <p>Pricing that scales with your business immediately.</p>
        </div>
         <div className="slideImage">
         <Row gutter={8}>
              <Col span={8}>
              <Card hoverable style={{ width: 250}}>
                 <h6>Product's name</h6>
                 <div style={{ overflow: 'hidden', height: 190, marginBottom: '30px' }}>
                   <img
                   alt="example"
                   src="/gif-ne-2.gif"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                     <Button>Register for auction</Button>
                 </div>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Starting price:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Price step:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Auction time:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>The writer's name:</Text>
                 </Paragraph>
              </Card>
              </Col>
              <Col span={8}>
              <Card hoverable style={{ width: 250 }}>
                 <h6>Product's name</h6>
                 <div style={{ overflow: 'hidden', height: 190, marginBottom: '30px' }}>
                   <img
                   alt="example"
                   src="/gif-ne-3.gif"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                     <Button>Register for auction</Button>
                 </div>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Starting price:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Price step:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Auction time:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>The writer's name:</Text>
                 </Paragraph>
              </Card>
              </Col>
              <Col span={8}>
              <Card hoverable style={{ width: 250 }}>
                 <h6>Product's name</h6>
                 <div style={{ overflow: 'hidden', height: 190, marginBottom: '30px' }}>
                 <img
                   alt="example"
                   src="/gif-ne-4.gif"
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                     <Button>Register for auction</Button>
                 </div>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Starting price:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Price step:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>Auction time:</Text>
                 </Paragraph>
                 <Paragraph>
                 <InfoCircleOutlined /> <Text>The writer's name:</Text>
                 </Paragraph>
              </Card>
              </Col>
            </Row>
         </div>
       </div>
       <div>
       </div>
       </div>
         <FooterNavbar />
         </>
       )
}
export default Home;