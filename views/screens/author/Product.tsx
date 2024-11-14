'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Layout,
  Menu,
  Upload,
  theme,
  MenuProps,
  DatePicker,
} from 'antd';
import {
  BarChartOutlined,
  ProductOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { getProductById } from '../../services/author/AuthorServices';
import NavbarSetting from '@/views/components/NavbarSetting';
import { getAuction } from '@/views/services/AuctionServices';
import moment from 'moment';
import { handleAddNewProduct } from '@/views/utils/author/compProduct/addProduct';
import { handleEditProduct } from '@/views/utils/author/compProduct/editProduct';
import { handleDeleteProduct } from '@/views/utils/author/compProduct/deleteProduct';

const { Header, Content, Sider } = Layout;

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

interface Product {
  startTime: number;
  endTime: number;
  id: any;
  productname: string;
  image: string;
  description: string;
  price: string;
  auctionTime: any;
  status: 'Chưa được đấu giá';
}

export default function Product() {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);


  // Mở modal Add Product
  const openAddProductModal = () => {
    setIsEditMode(false);
    form.resetFields();
    setOpenModal(true);
  };

  // Mở modal Edit Product với thông tin sản phẩm
  const openEditProductModal = (record: Product) => {
    setIsEditMode(true);
    setEditingProduct(record); // Lưu sản phẩm đang chỉnh sửa
    const auctionTimeMinutes = Math.round((record.endTime - record.startTime) / 60000);

    // Đặt các giá trị của sản phẩm vào form
    form.setFieldsValue({
      productname: record.name,
      description: record.description,
      price: record.price,
      auctionTime: auctionTimeMinutes,
      startTime: moment(record.startTime),
      status: record.status,
      image: [{ url: record.image, name: 'Current Image' }],
    });

    setOpenModal(true); // Mở modal
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    if (isEditMode) {
      await handleEditProduct(formData, editingProduct.id, editingProduct, setProducts); // Gọi hàm chỉnh sửa
    } else {
      await handleAddNewProduct(formData, setLoading, setProducts,  () => {});
    }
    setLoading(false); // Tắt trạng thái loading
    setOpenModal(false); // Đóng modal sau khi hoàn tất
  };

  const handleDelete = (id: number) => {
    setDeletingProductId(id);
    setConfirmDeleteVisible(true);
  };

  // Xác nhận xóa sản phẩm
  const confirmDeleteProduct = async () => {
    if (deletingProductId !== null) {
      await handleDeleteProduct(deletingProductId);
      setDeletingProductId(null);
      setConfirmDeleteVisible(false);
    }
  };

  useEffect(() => {
    const authorId = localStorage.getItem('authorId');
    if (authorId) {
      getProductById(authorId).then(async (response) => {
        if (response && response.products) {
          const fetchedProducts = response.products.map((product: any) => {
            const endTimeInSeconds = product.endTime;
            const startTimeInMs = new Date(product.startTime).getTime();
            const endTime = endTimeInSeconds * 1000;
            return {
              id: product.id,
              name: product.productName,
              image: product.imageUrl,
              description: product.description,
              price: product.startingPrice,
              startTime: startTimeInMs,
              endTime,
            };
          });
          const auctionStatusData = await getAuction();
          const updatedProducts = fetchedProducts.map((product: any) => {
            const productStatus = auctionStatusData.find(
              (statusItem: any) => statusItem.productId === product.id || statusItem.id === product.id
            );
            const currentTime = Date.now();
            let status = '';
            // Điều kiện cho trạng thái dựa trên startTime và thời gian hiện tại
            if (currentTime < product.startTime) {
              status = 'Cuộc đấu giá chưa diễn ra';
            } else if (currentTime >= product.startTime && currentTime < product.endTime) {
              status = 'Cuộc đấu giá đang diễn ra';
            } else {
              status = 'Cuộc đấu giá đã kết thúc';
            }

            return {
              ...product,
              status,
            };
          });
          setProducts(updatedProducts);
          const interval = setInterval(() => {
            setProducts((prevProducts) => {
              return prevProducts.map((product) => {
                const currentTime = Date.now();
                if (currentTime < product.startTime) {
                  return {
                    ...product,
                    auctionTime: 'Chưa bắt đầu',
                    status: 'Cuộc đấu giá chưa diễn ra'
                  };
                } else if (currentTime >= product.startTime && currentTime < product.endTime) {
                  const remainingTime = Math.max(0, product.endTime - currentTime);
                  return {
                    ...product,
                    auctionTime: `${Math.floor((remainingTime % 3600000) / 60000)} : ${Math.floor((remainingTime % 60000) / 1000)}`,
                    status: 'Cuộc đấu giá đang diễn ra',
                  };
                } else {
                  return {
                    ...product,
                    auctionTime: 'Hết thời gian',
                    status: 'Cuộc đấu giá đã kết thúc'
                  };
                }
              });
            });
          }, 1000);

          return () => clearInterval(interval);
        }
      })
        .catch((error) => {
          console.error('Lỗi khi tải sản phẩm:', error);
        });
    }
  }, []);
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchTerm],
      onFilter: (value: any, record: Product) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text: string) => (
        <img src={text} alt="Product" style={{ width: '50px', height: '50px' }} />
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá khởi điểm',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Thời gian đấu giá',
      dataIndex: 'auctionTime',
      key: 'auctionTime',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime: number) => (
        startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : 'Không có dữ liệu'
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: Product) => (
        <div>
          <Button icon={<EditOutlined />} onClick={() => openEditProductModal(record)}>
            Chỉnh sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: '8px' }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

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
          }}>
            <h3>Product</h3>
          </div>
          <div className='divInfor' style={{ padding: 15, minHeight: 485, background: colorBgContainer }}>
            <Row justify="space-between">
              <div style={{ marginBottom: '16px' }}>
                <Button className='butUpload' type="text" onClick={() => openAddProductModal()}>Upload Product</Button>
              </div>

              <div className='search' style={{ marginBottom: '16px', display: 'flex', justifyContent: 'right' }}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm kiếm sản phẩm..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Row>
            <Table
              dataSource={products.filter(product =>
                product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              columns={columns}
              pagination={{ pageSize: 4 }}
            />
            <Modal
              title={isEditMode ? 'Edit Product' : 'Add Product'}
              visible={openModal}
              onCancel={() => setOpenModal(false)}
              footer={[
                <Button key="cancel" onClick={() => setOpenModal(false)}>Cancel</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                  Submit
                </Button>,
              ]}
            >
              <Form form={form} id="product-form" layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="productname" label="Product Name" rules={[{ required: true, message: 'Please input product name!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input description!' }]}>
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input price!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Hình ảnh sản phẩm" name="image" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}>
                  <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="auctionTime"
                  label="Thời gian đấu giá (phút)"
                  rules={[{ required: true, message: 'Thời gian đấu giá không được để trống' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: 'Please select start time!' }]}>
                  <DatePicker showTime />
                </Form.Item>
              </Form>
            </Modal>
            {/* Modal xác nhận xóa sản phẩm */}
            <Modal
              title="Confirm Delete"
              visible={confirmDeleteVisible}
              onCancel={() => setConfirmDeleteVisible(false)}
              onOk={confirmDeleteProduct}
              okText="Yes"
              cancelText="No"
            >
              <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

