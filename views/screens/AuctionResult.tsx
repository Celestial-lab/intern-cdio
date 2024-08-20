'use client'

import React, { useState } from "react";
import { Col, DatePicker, Input, Row, Space, Button, Table, Collapse } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import "@/views/style/AuctionResult.css";
import type { CSSProperties } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { theme } from 'antd';

const AuctionResults = () => {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  const onChangeStart = (date, dateString) => {
    setStartDateTime(dateString);
  };

  const onChangeEnd = (date, dateString) => {
    setEndDateTime(dateString);
  };

  // Data for the table
  const columns = [
    {
      title: "Product's Name",
      dataIndex: 'col1',
      key: 'col1',
    },
    {
      title: "Author's Name",
      dataIndex: 'col2',
      key: 'col2',
    },
    {
      title: 'Winning auction price',
      dataIndex: 'col3',
      key: 'col3',
    },
  ];

  const data = [
    {
      key: '1',
      col1: 'Tretana',
      col2: 'Tan Phan',
      col3: '1000 ',
    },
    {
      key: '2',
      col1: 'PuSheen',
      col2: 'Tan Phan',
      col3: '400',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="container">
        <div>
          <h1 className="titleStyle">Auction Results</h1>
          <div className="rowStyle">
            <Row gutter={[32, 32]}>
              <Col className="colStyle" span={6}>
                <Space direction="vertical">
                  <DatePicker 
                    onChange={onChangeStart} 
                    placeholder='From' 
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className="datePickerStyle" 
                  />
                </Space>
              </Col>
              <Col className="colStyle" span={6}>
                <Space direction="vertical">
                  <DatePicker 
                    onChange={onChangeEnd} 
                    placeholder='To' 
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className="datePickerStyle" 
                  />
                </Space>
              </Col>
              <Col className="colStyle" span={6}>
                <Input placeholder="Product's Name" className="datePickerStyle" />
              </Col>
              <Col className="colStyle" span={6}>
                <Button type="text" className="buttonStyle">Search</Button>
              </Col>
            </Row>
          </div>
        </div>
                
        <div className="divCollapse">
          <Collapse className="nene"
            bordered={false} 
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: token.colorBgContainer}}
          >
            <Collapse.Panel 
              header={`Auction results from ${startDateTime || 'date time'} to ${endDateTime || 'date time'}`} 
              key="1"
              style={panelStyle}
            >
              <Table columns={columns} dataSource={data} />
            </Collapse.Panel>
          </Collapse>
        </div>

        <div className="divCollapse">
          <Collapse className="nene"
            bordered={false} 
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: token.colorBgContainer}}
          >
            <Collapse.Panel 
              header={`Auction results from ${startDateTime || 'date time'} to ${endDateTime || 'date time'}`}  
              key="1"
              style={panelStyle}
            >
              <Table columns={columns} dataSource={data} />
            </Collapse.Panel>
          </Collapse>
        </div>

        <div className="divCollapse">
          <Collapse className="nene"
            bordered={false} 
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: token.colorBgContainer}}
          >
            <Collapse.Panel 
              header={`Auction results from ${startDateTime || 'date time'} to ${endDateTime || 'date time'}`} 
              key="1"
              style={panelStyle}
            >
              <Table columns={columns} dataSource={data} />
            </Collapse.Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default AuctionResults;
