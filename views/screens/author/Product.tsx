'use client'

import React, { useState } from 'react';
import { Avatar, Button, Form, Input, Modal, Row, Col, Table, Layout, Menu, theme, Upload, MenuProps } from 'antd';
import { BarChartOutlined, BellOutlined, DollarOutlined, ProductOutlined, UserOutlined, EditOutlined, DeleteOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';

const { Header, Content, Sider, Footer } = Layout;

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

const initialData: Product[] = [
    {
      key: '1',
      name: 'Sản phẩm 1',
      image: '/gif-11-Droners.gif',
      description: 'Mô tả sản phẩm 1',
      uploadDate: '15/08/2024',
      price: '$100',
      status: 'Chưa được đấu giá',
    },
    {
      key: '2',
      name: 'Sản phẩm 2',
      image: '/gif-14-CartoonNetworkAsia.gif',
      description: 'Mô tả sản phẩm 2',
      uploadDate: '16/08/2024',
      price: '$200',
      status: 'Đã được đấu giá',
    },
  ];


interface FormValues {
  name: string;
  image: string; // Changed from File to string for simplicity
  description: string;
  price: number;
  status: 'Đã được đấu giá' | 'Chưa được đấu giá';
}

interface Product {
  key: string;
  name: string;
  image: string; // Changed from File to string for simplicity
  description: string;
  uploadDate: string;
  price: string;
  status: 'Đã được đấu giá' | 'Chưa được đấu giá';
}

export default function Product() {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [data, setData] = useState<Product[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUploadProduct = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

  const handleOk = (values: FormValues) => {
    const newProduct: Product = {
      key: `${data.length + 1}`,
      name: values.name,
      image: selectedImage || values.image,
      description: values.description,
      uploadDate: new Date().toLocaleDateString(),
      price: `$${values.price}`,
      status: values.status,
    };

    if (editingProduct) {
      // Update existing product
      setData(data.map(product => product.key === editingProduct.key ? newProduct : product));
    } else {
      // Add new product
      setData([...data, newProduct]);
    }

    setOpenModal(false);
    form.resetFields();
    setSelectedImage(null);
  };

  const handleEdit = (key: string) => {
    const product = data.find(item => item.key === key);
    if (product) {
      form.setFieldsValue({
        name: product.name,
        image: product.image,
        description: product.description,
        price: product.price.replace('$', ''),
        status: product.status,
      });
      setSelectedImage(product.image);
      setEditingProduct(product);
      setOpenModal(true);
    }
  };

  const handleDelete = (key: string) => {
    setData(data.filter(item => item.key !== key));
    setConfirmDeleteVisible(false);
  };

  const handleConfirmDelete = (key: string) => {
    setProductToDelete(key);
    setConfirmDeleteVisible(true);
  };

  const handleImageChange = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  const filteredData = data.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Product Image', 
      dataIndex: 'image', 
      key: 'image', 
      render: (text: string) => <img 
        src={text} 
        alt="product" 
        style={{ 
          width: '80px', 
          height: '80px', 
          objectFit: 'cover',
          display: 'block',
          margin: '0 auto'
        }} 
      /> 
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Upload Date', dataIndex: 'uploadDate', key: 'uploadDate' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {  
      key: 'actions', 
      render: (record: { key: string; }) => (
        <div>
          <Button 
            icon={<EditOutlined />} 
            style={{ 
              marginRight: '8px', 
              backgroundColor: 'transparent',
              border: 'none'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => handleEdit(record.key)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            style={{ 
              backgroundColor: 'transparent',
              border: 'none'
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => handleConfirmDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical"  />
        <Menu theme="dark" defaultSelectedKeys={['product']} mode="inline" items={items} />
      </Sider>
      <Layout>
      <Header className='headerInfor'>
            <Row className='row'>
                <Col className='col1' span={12}>
                    <div className='name'><p>Hello, DanLe</p></div>
                    <div className='date'><p>Tue, 29 July 2024</p></div>
                </Col>
            <Col className='col2' span={12}>
                <Row className='headerRight'>
                    <div className='iconBell'><BellOutlined style={{color: 'grey'}}/></div>
                    <div className='iconDollar'><DollarOutlined style={{color: 'grey'}}/>
                        <div className='showTotalMoney'>:</div>
                    </div>
                    <div className='avt1'><Avatar shape="square" style={{color: 'grey', background: 'white'}} size={40} icon={<UserOutlined />} /></div>
              </Row>
            </Col>

            </Row>
        </Header>

        <Content style={{ margin: '16px' }}>
            <div className='divTitle' style={{
                padding: 5,
                maxHeight: 60,
                background: colorBgContainer,
                }}><h3>Product</h3>
            </div>
            <div className='divInfor' style={{padding: 15, minHeight: 485, background: colorBgContainer}}>
          
          <Row justify="space-between" >

            <div style={{ marginBottom: '16px' }}>
              <Button className='butUpload' type="text" onClick={handleUploadProduct}>Upload Product</Button>
            </div>

            <div className='search' style={{ marginBottom: '16px', display: 'flex', justifyContent: 'right' }}>
              <Input 
                prefix={<SearchOutlined />}
                placeholder="Searching..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                style={{ width: 200 }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#22C55E'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d9d9d9'}
              />
            </div>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }} 
          />

          <Modal
            title={editingProduct ? "Edit Product" : "Upload Product"}
            open={openModal}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} onFinish={handleOk}>
              <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please enter product name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Product Image">
                <Upload
                  showUploadList={false}
                  beforeUpload={handleImageChange}
                  accept=".png,.jpg,.jpeg,.gif"
                >
                  <Button icon={<UploadOutlined />}>Choose</Button>
                </Upload>
                {selectedImage && (
                  <img src={selectedImage} alt="Selected" style={{ marginTop: '16px', width: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                )}
              </Form.Item>
              <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter price!' }]}>
                <Input type="number" />
              </Form.Item>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please enter status!' }]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">{editingProduct ? "Update" : "Submit"}</Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Confirm Deletion"
            open={confirmDeleteVisible} 
            onOk={() => handleDelete(productToDelete!)}
            onCancel={() => setConfirmDeleteVisible(false)}
            okText="Yes"
            cancelText="No"
          >
            <p>Are you sure you want to delete this product??</p>
          </Modal>
          </div>
        </Content>

        <Footer></Footer>
      </Layout>
    </Layout>
  );
}
