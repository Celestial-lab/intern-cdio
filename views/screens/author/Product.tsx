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
  message,
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
import { deleteProductById, editProductById, editProfileById, getAuctionStatus, getProductById, handleAddProduct } from '../../services/author/AuthorServices';
import axios from '../../axios';
import NavbarSetting from '@/views/components/NavbarSetting';

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
  endTime: number;
  id: any;
  name: string;
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);


  // Hàm thêm sản phẩm mới
  const handleAddNewProduct = async (values: any) => {
    try {
      const email = localStorage.getItem('authorEmail');
      const authorId = localStorage.getItem('authorId');
  
      if (!email || !authorId) {
        console.error('Không tìm thấy email hoặc ID tác giả.');
        return;
      }
  
      const formData = new FormData();
      formData.append('email', email);
      formData.append('authorId', authorId);
      formData.append('productname', values.name);
      formData.append('description', values.description);
      formData.append('startingPrice', values.price);
      formData.append('durationInMinutes', values.auctionTime);
  
      if (values.image && values.image[0]) {
        formData.append('image', values.image[0].originFileObj);
      }

      const newProductData = await handleAddProduct(formData);

      console.log('newProductData nè: ', newProductData);
  
      if (newProductData) {
        const newProduct = {
          key: newProductData.product.id,
          name: newProductData.product.productname,
          image: newProductData.product.image,
          description: newProductData.product.description,
          price: newProductData.product.price,
          status: newProductData.product.status,
        };
  
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        message.success('Upload thành công');
        handleCancel();
      } else {
        console.error('Thêm sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật sản phẩm:', error);
    }
  };
  // Mở modal cho việc chỉnh sửa sản phẩm
  const openEditProductModal = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      auctionTime: record.auctionTime,
      status: record.status,
    });
    setOpenModal(true);
  };

  // Hàm chỉnh sửa sản phẩm
  const handleEditProduct = async (values: any) => {
    const email = localStorage.getItem('authorEmail');
    const authorId = localStorage.getItem('authorId');

    if (!email || !authorId || !editingProduct) {
      message.error('Không tìm thấy email, ID tác giả hoặc sản phẩm để chỉnh sửa.');
      return;
    }
    const formData = new FormData();
    formData.append('email', email);
    formData.append('authorId', authorId);
    formData.append('productname', values.name);
    formData.append('description', values.description);
    formData.append('startingPrice', values.price);
    formData.append('durationInMinutes', values.auctionTime);
    if (values.image && values.image.file) {
      formData.append('image', values.image.file);
    }
    try {
      const response = await editProductById(editingProduct.id, values);

      console.log('api trả response về: ',response);

      console.log('code: ', response.errorCode);

      if (response && response.status === 200 && response.data) {
        const updatedProduct = {
          ...editingProduct,
          name: values.name,
          description: values.description,
          price: values.price,
          auctionTime: values.auctionTime,
          image: response.data.product.image || editingProduct.image,
        };
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
        message.success('Cập nhật sản phẩm thành công');
        handleCancel();

      } else {
        message.error('Cập nhật sản phẩm thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật sản phẩm');
    }
  };

  const handleSubmit = (values: any) => {
    if (editingProduct) {
      handleEditProduct(values);
    } else {
      handleAddNewProduct(values);
    }
  };

  const handleDelete = (record: Product) => {
    setDeletingProduct(record);
    setConfirmDeleteVisible(true);
  };

  const confirmDeleteProduct = async () => {
    console.log('deleteProduct id: ', deletingProduct?.id);
    if (deletingProduct) {
      try {
        await deleteProductById(deletingProduct.id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== deletingProduct.id)
        );
        message.success('Xóa sản phẩm thành công');
      } catch (error) {
        message.error('Lỗi khi xóa sản phẩm');
      }
      setConfirmDeleteVisible(false);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
    setEditingProduct(null);
  };

  useEffect(() => {
    const authorId = localStorage.getItem('authorId');
    if (authorId) {
      getProductById(authorId)
        .then(async (response) => {
          if (response && response.products) {
            const fetchedProducts = response.products.map((product: any) => {
              const endTimeInSeconds = product.endTime; // endTime trả về từ API theo giây
              const endTime = endTimeInSeconds * 1000; // Chuyển đổi sang milliseconds
  
              return {
                id: product.id,
                name: product.productName,
                image: product.imageUrl,
                description: product.description,
                price: product.startingPrice,
                endTime, // Lưu trữ endTime để sử dụng cho đếm ngược
              };
            });
  
            const auctionStatusData = await getAuctionStatus();
  
            // Cập nhật trạng thái của từng sản phẩm dựa trên dữ liệu trả về từ API
            const updatedProducts = fetchedProducts.map((product: any) => {
              const productStatus = auctionStatusData.find(
                (statusItem: any) => statusItem.productId === product.id || statusItem.id === product.id
              );
              let status = 'Chưa có thông tin';
  
              if (productStatus) {
                status = productStatus.active ? 'Cuộc đấu giá đang diễn ra' : 'Cuộc đấu giá đã kết thúc';
              }
  
              return {
                ...product,
                status, // Gán trạng thái đã được cập nhật
              };
            });
  
            setProducts(updatedProducts);
  
            // Hàm cập nhật thời gian còn lại
            const interval = setInterval(() => {
              setProducts((prevProducts) => {
                return prevProducts.map((product) => {
                  const currentTime = Date.now();
                  const timeRemaining = product.endTime - currentTime; // Tính thời gian còn lại
  
                  // Tính phút và giây
                  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
                  if (timeRemaining > 0) {
                    return {
                      ...product,
                      auctionTime: `${minutes} : ${seconds}s`,
                    };
                  } else {
                    return {
                      ...product,
                      auctionTime: 'Cuộc đấu giá đã kết thúc',
                    };
                  }
                });
              });
            }, 1000);
  
            // Dọn dẹp interval khi component unmount
            return () => clearInterval(interval);
          } else {
            message.error('Không tìm thấy sản phẩm trong phản hồi');
          }
        })
        .catch((error) => {
          console.error('Lỗi khi lấy sản phẩm:', error);
          message.error('Lỗi khi lấy sản phẩm');
        });
    }
  }, []);
  

  const columns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    {
      title: 'Hình ảnh sản phẩm',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => <img src={image} alt="product" style={{ width: 100 }} />,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Giá khởi điểm', dataIndex: 'price', key: 'price' },
    {
      title: 'Thời gian đấu giá còn lại',
      dataIndex: 'auctionTime',
      key: 'auctionTime',
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Product) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => openEditProductModal(record)}>
            Sửa
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </span>
      ),
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );


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
                <Button className='butUpload' type="text" onClick={() => setOpenModal(true)}>Upload Product</Button>
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
              title="Thêm sản phẩm"
              open={openModal}
              onCancel={handleCancel}
              footer={null}
            >
              <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
                <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                  <Input.TextArea placeholder="Nhập mô tả sản phẩm" />
                </Form.Item>
                <Form.Item name="price" label="Giá khởi điểm" rules={[{ required: true }]}>
                  <Input placeholder="Nhập giá khởi điểm" />
                </Form.Item>
                <Form.Item name="auctionTime" label="Thời gian đấu giá" rules={[{ required: true }]}>
                  <Input placeholder="Nhập thời gian đấu giá (phút)" />
                </Form.Item>
                <Form.Item
                  label="Hình ảnh sản phẩm"
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                >
                  <Upload
                    listType="picture"
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button style={{ marginLeft: '8px' }} onClick={handleCancel}>
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal xác nhận xóa sản phẩm */}
            <Modal
              title="Xác nhận xóa"
              open={confirmDeleteVisible}
              onOk={confirmDeleteProduct}
              onCancel={handleCancel}
            >
              <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}


