'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { products } from "@/views/screens/Product/Data";
import Navbar from '@/views/components/Navbar';
import { Button, Col, Row } from 'antd';
import "@/views/style/ProductDetail.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeartOutlined } from '@ant-design/icons';

// Hàm chọn ngẫu nhiên một số phần tử từ một mảng
const getRandomItems = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const ProductDetail = () => {
  const params = useParams();
  const { productId } = params;
  const router = useRouter();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const product = products.find((product) => product.id === parseInt(productId, 10));
    setCurrentProduct(product);

    if (product) {
      const otherProducts = products.filter(p => p.id !== product.id);
      setSuggestedProducts(getRandomItems(otherProducts, 4));
    }
  }, [productId]);

  if (!currentProduct) {
    return <div>Product not found</div>;
  }

  const handleReadMore = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className='product-detail-container'>
        <Row gutter={[16, 16]}>
          <Col span={6} className='suggestions-column'>
            <div><h5 className='suggest-title'>Suggest Product</h5></div>
            {suggestedProducts.map((suggestedProduct, index) => (
              <div key={index} className='product-item'>
                <Col span={10} className='image-container'>
                  <img src={suggestedProduct.imageUrl} alt={suggestedProduct.productName} />
                </Col>
                <Col span={14} className='title-container'>
                  <div className='title-content'>
                    <h6>{suggestedProduct.productName}</h6>
                    <p>{suggestedProduct.price}</p>
                  </div>
                  <button
                    type="button"
                    className="read-more-btn"
                    onClick={() => handleReadMore(suggestedProduct.id)}
                  >
                    Read More
                  </button>
                </Col>
              </div>
            ))}
          </Col>

          <Col span={18} className='details-column'>
            <Row gutter={[16, 16]}>
              <Col span={12} className='image-container'>
                <img src={currentProduct.imageUrl} alt={currentProduct.productName} />
              </Col>
              <Col span={12} className='details-container'>
                <h1 className='product-name' style={{paddingBottom : '15px'}}>{currentProduct.productName}</h1>
                <p className='product-description'>The writer's</p>
                <p className='product-price'>{currentProduct.price}</p>
                <h6 className='auction-time'>Auction time: </h6>
                <h6 className='price-step'>Price step:</h6>
                <h6 className='product-description-title'>Product description: </h6>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
              <div className='button-container'>
                  <button type="button" className="btn">Register for auction</button>
                  <button type="button" className="btn">
                  <HeartOutlined /> Wishlist 
                  </button>
              </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProductDetail;
