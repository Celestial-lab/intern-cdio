'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { products } from "@/views/screens/Product/Data";
import Navbar from '@/views/components/Navbar';
import { Button, Col, Row } from 'antd';
import "@/views/style/ProductDetail.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeartOutlined } from '@ant-design/icons';
import FooterAll from '@/views/components/Footer';

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
      setSuggestedProducts(getRandomItems(otherProducts, 5));
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

      <section class="sec-detail py-4">
        <div class="div-details container">
          <div class="row">
            <div class="col-md-4 col-suggest">
              <div>
                <h5 className='suggest-title'>Suggest Product</h5>
              </div>
              {suggestedProducts.map((suggestedProduct, index) => (
                <div key={index} className='product-item d-flex mb-3'>
                  <div className="col-md-4 image-container">
                    <img class="img-suggest" src={suggestedProduct.imageUrl} alt={suggestedProduct.productName} />
                  </div>
                  <div className="col-md-8 title-container">
                    <div className='title-content'>
                      <h6 class="name-suggest">{suggestedProduct.productName}</h6>
                      <p class="price-suggest">{suggestedProduct.price}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-success read-more-btn"
                      onClick={() => handleReadMore(suggestedProduct.id)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div class="col-md-8 col-details">
              <div className="details-column">
                <div className="row mb-5">
                  <div className="col-md-7 image-container">
                    <img class="img-product" src={currentProduct.imageUrl} alt={currentProduct.productName}/>
                  </div>
                  <div className="col-md-5 details-container">
                    <h1 className='product-name mb-3'>{currentProduct.productName}</h1>
                    <p className='product-price'> {currentProduct.price}</p>
                    <p className='product-author'>The writer{`'`}s:</p>
                    <p className='auction-time'>Auction time: </p>
                    <p className='price-step'>Price step:</p>
                    <p className='product-description-title'>Product description: </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className='button-container d-flex flex-column align-items-center'>
                      <button class="btn-regis mb-2">Register for auction</button>
                      <button class="btn-wish">
                        <i className="fa fa-heart" /> Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterAll />
    </>
  );
};

export default ProductDetail;
