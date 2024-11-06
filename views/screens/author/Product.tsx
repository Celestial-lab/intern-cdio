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
import { deleteProductById, editProductById, getAuctionStatus, getProductById, handleAddProduct } from '../../services/author/AuthorServices';
import NavbarSetting from '@/views/components/NavbarSetting';
import moment from 'moment';

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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Thêm sản phẩm mới
  const handleAddNewProduct = async (values: any) => {

    const authorId = localStorage.getItem('authorId');

    if (!authorId) {
      console.error('Không tìm thấy ID tác giả.');
      return;
    }

    const formData = new FormData();
      formData.append('loginId', authorId);
      formData.append('productname', values.productname);
      formData.append('description', values.description);
      formData.append('startingPrice', values.price);
      formData.append('durationInMinutes', values.auctionTime);
      formData.append('startTime', values.startTime.toISOString());
      if (values.image && values.image[0] && values.image[0].originFileObj) {
        formData.append('image', values.image[0].originFileObj);
      } else {
        console.error('Ảnh không tồn tại hoặc không hợp lệ');
      };

      setLoading(true);

    try {
      const newProductData = await handleAddProduct(formData);

      console.log('newProductData trước if (và sau khi thực hiện thêm): ', newProductData);
      
      if (newProductData) {
        const newProduct = {
          key: newProductData.product.id,
          name: newProductData.product.productName,
          image: newProductData.product.image || newProductData.product.imageUrl,
          description: newProductData.product.description,
          price: newProductData.product.startingPrice,
          status: newProductData.product.active,
          auctionTime: newProductData.product.endTime,
          startTime: newProductData.product.startTime,
        };
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        message.success('Upload thành công');
        handleCancel();
      } else {
        console.error('Thêm sản phẩm thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chỉnh sửa sản phẩm
  const handleEditProduct = async (values: any) => {
    const authorId = localStorage.getItem('authorId');

    if (!editingProduct || editingProduct.status === 'Cuộc đấu giá đã kết thúc' || editingProduct.status === 'Cuộc đấu giá đang diễn ra') {
      message.error('Sản phẩm không thể chỉnh sửa vì trạng thái không cho phép.');
      return;
    }

    if (!authorId) {
      message.error('Không tìm thấy ID tác giả.');
      return;
    }
    const formData = new FormData();
    formData.append('loginId', authorId);
    formData.append('productname', values.productname);
    formData.append('description', values.description);
    formData.append('startingPrice', values.price);
    formData.append('durationInMinutes', values.auctionTime);
    formData.append('startTime', values.startTime.toISOString());
    if (values.image && values.image[0]) {
      formData.append('image', values.image[0].originFileObj);
    }

    console.log('values từ formData: ', values);

    try {
      const response = await editProductById(editingProduct.id, formData);

      console.log('response api trả về: ', response);

      if (response && response.product) {
        const updatedProduct = {
          ...editingProduct,
          name: values.name,
          description: values.description,
          price: values.price,
          auctionTime: values.auctionTime,
          startTime: values.startTime.unix(),
          image: response.product.image || editingProduct.image,
        };

        console.log('updatedProduct trước set: ', updatedProduct);

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            response.product.id === updatedProduct.id ? updatedProduct : product
          )
        );

        console.log('updatedProduct sau set: ', updatedProduct);

        message.success('Cập nhật sản phẩm thành công');
        // handleCancel();
      } else {
        message.error('Cập nhật sản phẩm thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật sản phẩm');
    }
  };

  const openEditProductModal = (record: Product) => {
    const auctionTimeMinutes = Math.round((record.endTime - record.startTime) / 60000);
    setEditingProduct(record);
    form.setFieldsValue({
      productname: record.name,
      description: record.description,
      price: record.price,
      auctionTime: auctionTimeMinutes,
      startTime: moment(record.startTime),
      status: record.status,
      image: [{ url: record.image, name: 'Current Image' }],
    });
    setOpenModal(true);
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

          const auctionStatusData = await getAuctionStatus();

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
            onClick={() => handleDelete(record)}
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
              title={editingProduct ? 'Edit Product' : 'Add Product'}
              open={openModal}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button
                  form="product-form"
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
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


