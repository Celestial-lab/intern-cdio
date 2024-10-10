'use client'

import React, { useState, useEffect } from 'react';
import { Avatar, Button, Form, Input, Modal, Row, Col, Table, Layout, Menu, theme, Upload, MenuProps } from 'antd';
import { BarChartOutlined, BellOutlined, DollarOutlined, ProductOutlined, UserOutlined, EditOutlined, DeleteOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import { deleteProductById, getProductByEmail, handleAddProduct } from '../../services/author/AuthorServices';
import { title } from 'process';
import axios from '../../axios';
import NavbarSetting from '@/views/components/NavbarSetting';

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
    label: <a href={href}>{label}</a>
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', 'dashboard', <BarChartOutlined />, '/author/settings/DashboardAuthor'),
  getItem('Product', 'product', <ProductOutlined />, '/author/settings/ProductAuthor'),
  getItem('Profile', 'profile', <UserOutlined />, '/author/settings/ProfileAuthor'),
];

interface Product {
  key: string;
  name: string;
  image: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    setOpenModal(true);
    form.setFieldValue({
      name: record.name,
      description: record.description,
      price: record.price,
      status: record.status,
    })
  };

  const handleSubmit = async (values) => {
    try {
      const email = localStorage.getItem('authorEmail');
      if (!email) {
        console.error('Không tìm thấy email tác giả.');
        return;
      }

      const formData = new FormData();
      formData.append('email', email);
      formData.append('productname', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('status', values.status);
      if (values.image && values.image.file) {
        formData.append('image', values.image.file);
      }

      if (editingProduct) {
        const response = await axios.put(`/api/products/${editingProduct.key}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response && response.data) {
          const updatedProduct = {
            ...editingProduct,
            name: values.name,
            description: values.description,
            price: values.price,
            status: values.status,
            image: response.data.product.image || editingProduct.image,
          };
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.key === updatedProduct.key ? updatedProduct : product
            )
          );
          setEditingProduct(null);
          handleCancel();
        } else {
          console.error('Cập nhật sản phẩm thất bại:', response);
        }
      } else {

        console.log('log formData nè: ',formData);

        const response = await handleAddProduct(formData);
        // const data = response?.data;

        console.log('log response product.tsx nè: ', response);

        if (response && response.data) {
          const newProduct = {
            key: response.data.product.id,
            name: response.data.product.productname,
            image: response.data.product.image,
            description: response.data.product.description,
            uploadDate: response.data.product.createdAt,
            price: response.data.product.price,
            status: response.data.product.status,
          };
          setProducts((prevProducts) => [...prevProducts, newProduct]);
          handleCancel();
        } else {
          console.error('Thêm sản phẩm thất bại:', response);
        }
      }
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật sản phẩm:', error);
    }
  };



  const handleDelete = async (record: Product) => {
    setDeletingProduct(record);
  };

  const confirmDeleteProduct = async () => {
    if (deletingProduct) {
      try {
        await deleteProductById(deletingProduct.key);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.key !== deletingProduct.key)
        );
        setDeletingProduct(null);
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const cancelDelete = () => {
    setDeletingProduct(null);
  };

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Product Image',
      dataIndex: 'image',
      key: 'image',
      render: (url) => (
        <img
          src={url}
          alt="product"
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto',
          }}
        />
      ),
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Created At', dataIndex: 'uploadDate', key: 'uploadDate' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            style={{
              marginRight: '8px',
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onClick={() => handleEdit(record)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          />
          <Button
            icon={<DeleteOutlined />}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onClick={() => handleDelete(record)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const email = localStorage.getItem('authorEmail');
    // console.log('author email: ',email);
    if (email) {
      getProductByEmail(email).then((response) => {
        if (response && response.products && Array.isArray(response.products)) {
          const mappedProducts = response.products.map((product, index) => ({
            key: product.id,
            name: product.productname,
            image: product.image,
            description: product.description,
            uploadDate: product.createdAt,
            price: product.price,
            status: product.status,
          }));
          setProducts(mappedProducts);
        } else {
          console.error('Expected an array but got:', response);
        }
      }).catch((error) => {
        console.error('Failed to fetch products by email:', error);
      });
    }
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['product']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header className='headerInfor'>
          <NavbarSetting />
        </Header>

        <Content style={{ margin: '16px' }}>
          <div className='divTitle' style={{
            padding: 5,
            maxHeight: 60,
            background: colorBgContainer,
          }}><h3>Product</h3>
          </div>
          <div className='divInfor' style={{ padding: 15, minHeight: 485, background: colorBgContainer }}>
            <Row justify="space-between">
              <div style={{ marginBottom: '16px' }}>
                <Button className='butUpload' type="text" onClick={() => setOpenModal(true)}>Upload Product</Button>
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
              dataSource={products}
              pagination={{ pageSize: 5 }}
            />

            <Modal
              title={editingProduct ? "Edit Product" : "Upload Product"}
              open={openModal}
              onCancel={handleCancel}
              footer={null}
            >
              <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Hình ảnh sản phẩm" name="image" valuePropName="file">
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>

                <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                  <Input.TextArea />
                </Form.Item>

                <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                  <Input type="number" />
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {editingProduct ? "Cập nhật" : "Tải lên"}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Xác nhận xóa sản phẩm"
              open={!!deletingProduct}
              onOk={confirmDeleteProduct}
              onCancel={cancelDelete}
              okText="Xóa"
              cancelText="Hủy"
            >
              <p>Bạn có chắc chắn muốn xóa sản phẩm {deletingProduct?.name} không?</p>
            </Modal>

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>DanLe</Footer>
      </Layout>
    </Layout>
  );
};