'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/views/components/Navbar';
import "@/views/style/ProductDetail.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import FooterAll from '@/views/components/Footer';
import { getAuction, getAuctionById } from '@/views/services/AuctionServices';

const ProductDetail = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]); // Thêm state cho suggestedProducts
  const [remainingTime, setRemainingTime] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auctionId = localStorage.getItem('auctionId');

    if (auctionId) {
      const fetchProduct = async () => {
        const productData = await getAuctionById(auctionId);
        console.log('data của sản phẩm: ', productData.productName);
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

  // Tạo useEffect để lấy suggestedProducts
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        const allAuctions = await getAuction();
        console.log('Dữ liệu các sản phẩm gợi ý:', allAuctions);
        setSuggestedProducts(allAuctions); // Giả sử allAuctions chứa danh sách sản phẩm
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm gợi ý:', error);
      }
    };
    fetchSuggestedProducts();
  }, []);

  // Tính toán thời gian còn lại
  useEffect(() => {
    if (currentProduct) {
      const endTimeInMilliseconds = currentProduct.endTime * 1000; // Chuyển epoch seconds sang milliseconds
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

      return () => clearInterval(intervalId); // Dọn dẹp interval khi component unmount
    }
  }, [currentProduct]);

  if (!currentProduct) {
    return <div>Product not found</div>;
  }

  const handleReadMore = (id) => {
    router.push(`/products/${id}`);
  };

  const handleRegisterClick = () => {
    console.log('Đăng ký cho sản phẩm:', currentProduct);
    alert(`Bạn đã đăng ký thành công cho sản phẩm: ${currentProduct.productName}`);
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
                      <p class="price-suggest">{suggestedProduct.startingPrice}</p>
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
                    <p className='product-price'>{currentProduct.startingPrice}</p>
                    <p className='product-author'>The writer{`'`}s:</p>
                    <p className='auction-time'>Auction time: {remainingTime}</p>
                    <p className='product-description-title'>Product description: {currentProduct.description}</p>
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
