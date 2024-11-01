'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/views/components/Navbar';
import "@/views/style/ProductDetail.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import FooterAll from '@/views/components/Footer';
import { getAuction, getAuctionById } from '@/views/services/AuctionServices';
import NavbarAfter from '@/views/components/NavbarAfter';
import { addRegisterAuction } from '@/views/services/user/ProfileServices';

const ProductDetail = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [remainingTime, setRemainingTime] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auctionId = localStorage.getItem('auctionId');
    if (auctionId) {
      const fetchProduct = async () => {
        const productData = await getAuctionById(auctionId);
        if (productData) {
          setCurrentProduct(productData);
        } else {
          console.error('Không tìm thấy sản phẩm!');
        }
      };
      fetchProduct();
    } else {
      console.error('Không có auctionId trong localStorage!');
    }
  }, []);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const allAuctions = await getAuction();
        setSuggestedProducts(allAuctions);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm gợi ý:', error);
      }
    };
    fetchSuggestedProducts();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    console.log('token access: ', token);
    if (!token) {
      setIsLoggedIn(false);
      const userConfirmed = window.confirm("Bạn chưa đăng nhập, hãy đăng nhập!");
      if (userConfirmed) {
        window.location.href = '/user/signin';
      }
    } else {
      setIsLoggedIn(true); 
    }
  }, []);

  useEffect(() => {
    if (currentProduct) {
      const endTimeInMilliseconds = currentProduct.endTime * 1000;
      const intervalId = setInterval(() => {
        const now = Date.now();
        const timeLeft = endTimeInMilliseconds - now;

        if (timeLeft < 0) {
          clearInterval(intervalId);
          setRemainingTime('Đã kết thúc');
        } else {
          const minutes = Math.floor((timeLeft / 1000) / 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
          setRemainingTime(`${minutes} phút ${seconds} giây`);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [currentProduct]);

  if (!currentProduct) {
    return <div>Product not found</div>;
  }

  const handleRegisterClick = async () => {
    if (!localStorage.getItem('accessToken')) {
      alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để đăng ký đấu giá!');
      router.push('/user/signin');
      return;
    } 
  
    const userId = localStorage.getItem('userId');
    const auctionId = localStorage.getItem('auctionId');
  
    if (!auctionId) {
      alert('Không tìm thấy thông tin đấu giá. Vui lòng thử lại sau.');
      return;
    }
    try {
      const response = await addRegisterAuction(userId, auctionId);

      console.log('response nè: ', response);

      if (response) {
        alert('Đăng ký đấu giá thành công!');
      } else {
        alert('Đăng ký đấu giá không thành công. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký đấu giá:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <>
      {isLoggedIn ? <NavbarAfter /> : <Navbar />}

      <section className="sec-detail py-4">
        <div className="div-details container">
          <div className="row">
            <div className="col-md-4 col-suggest">
              <div>
                <h5 className='suggest-title'>Suggest Product</h5>
              </div>
              {suggestedProducts.map((suggestedProduct, index) => (
                <div key={index} className='product-item d-flex mb-3'>
                  <div className="col-md-4 image-container">
                    <img className="img-suggest" src={suggestedProduct.imageUrl} alt={suggestedProduct.productName} />
                  </div>
                  <div className="col-md-8 title-container">
                    <div className='title-content'>
                      <h6 className="name-suggest">{suggestedProduct.productName}</h6>
                      <p className="price-suggest">{suggestedProduct.startingPrice}</p>
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

            <div className="col-md-8 col-details">
              <div className="details-column">
                <div className="row mb-5">
                  <div className="col-md-7 image-container">
                    <img className="img-product" src={currentProduct.imageUrl} alt={currentProduct.productName} />
                  </div>
                  <div className="col-md-5 details-container">
                    <h1 className='product-name mb-3'>{currentProduct.productName}</h1>
                    <p className='product-price'>{currentProduct.startingPrice}</p>
                    <p className='product-author'>The writer{`'`}s:</p>
                    <p className='auction-time'>Auction time: {remainingTime}</p>
                    <p className='product-description-title'>Product description: {currentProduct.description}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className='button-container d-flex flex-column align-items-center'>
                      <button className="btn-regis mb-2" onClick={handleRegisterClick}>Register for auction</button>
                      <button className="btn-wish">
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
