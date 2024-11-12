'use client'

import React, { useEffect, useState, useCallback } from 'react';
import "@/views/style/LiveAuction.css";
import { Row, Button, message} from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import Navbar from '@/views/components/Navbar';
import NavbarAfter from '@/views/components/NavbarAfter';
import { useParams } from 'next/navigation';
import { getAuctionById, getHighestPrice } from '@/views/services/AuctionServices';




export default function LiveAuction() {
  
  const [multiplier, setMultiplier] = useState(1);
  const [cards, setCards] = useState([
    { id: 1, price: 1000, time: '10:00:32', round: 1, user: 'User A', topCard: true },
    { id: 2, price: 900, time: '09:45:21', round: 2, user: 'User B', topCard: false },
    { id: 3, price: 850, time: '09:30:15', round: 3, user: 'User C', topCard: false },
    { id: 4, price: 800, time: '09:20:10', round: 4, user: 'User D', topCard: false },
    { id: 5, price: 750, time: '09:10:05', round: 5, user: 'User E', topCard: false },
    { id: 6, price: 700, time: '09:05:00', round: 6, user: 'User F', topCard: false },
  ]);
  const [countdown, setCountdown] = useState(600); // 10 minutes countdown
  // lấy auctionId và registrationId từ useParams
  const {auctionIdLive, registrationId} = useParams();
  const [auctionData, setAuctionData] = useState<any[]>([]);
  const [minutes, setMinutess] = useState(0);
  const [seconds, setSecondss] = useState(0);
  const [highestPrice, setHighestPrice] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({ minutes: 0, seconds: 0 });

  
  useEffect(() => {
    const getInforAuction = async () => {
      if (auctionIdLive) {
        const response = await getAuctionById(auctionIdLive);

        console.log('response: ', response);

        if (response) {
          const auctionDataAfterGet = [{
            name: response.productName,
            timeRemaining: response.endTime,
            description: response.description,
            startingPrice: response.startingPrice,
            imageUrl: response.imageUrl,
            id: response.auctionId,
            active: response.active,
            startTime: response.startTime,
          }];
          setAuctionData(auctionDataAfterGet);
        }
      }
    };
    getInforAuction();
  }, [auctionIdLive]);

  useEffect(() => {
    if (auctionData.length > 0) {
      const startTimeStr = auctionData[0].startTime;
      const startTime = new Date(startTimeStr).getTime();
      // console.log('startTime: ', startTime);
  
      const timeless = auctionData[0].timeRemaining * 1000; // Chuyển từ giây sang mili giây
      // console.log('timeless: ', timeless);
  
      const currentTime = new Date().getTime(); // Thời gian hiện tại
      // console.log('currentTime: ', currentTime);
  
      // Kiểm tra nếu startTime không hợp lệ
      if (isNaN(startTime)) {
        console.error('startTime không hợp lệ:', startTimeStr);
        return; // Dừng lại nếu startTime không hợp lệ
      }
  
      if (currentTime < startTime) {
        message.error('Cuộc đấu giá chưa diễn ra');
      } else if (currentTime >= startTime && currentTime < timeless) {
        message.success('Cuộc đấu giá đang diễn ra');
  
        const updateTimer = setInterval(() => {
          const now = new Date().getTime();
          const remainingTime = Math.max(0, timeless - now);
  
          if (remainingTime > 0) {
            const minutesLeft = Math.floor((remainingTime % 3600000) / 60000);
            const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
  
            setTimeLeft({
              minutes: minutesLeft,
              seconds: secondsLeft,
            });
          } else {
            // console.log('Đếm ngược kết thúc.');
            clearInterval(updateTimer); // Dừng bộ đếm khi hết thời gian
            setTimeLeft({ minutes: 0, seconds: 0 });
          }
        }, 1000);
      } else {
        message.error('Cuộc đấu giá đã kết thúc');
      }
    }
  }, [auctionData]);

  //lấy giá trị tiền cao nhất
  useEffect (() => {
    const getHighest = async () => {
      if (auctionIdLive) {
        const response = await getHighestPrice(auctionIdLive);

        console.log('response lấy giá trị cao nhất', response);

        const highestPriceGet = response.highestBidder;

        setHighestPrice(highestPriceGet);

        
      }
    };
    getHighest();
  }, [])

 

  const price = 1000;
  const currentPrice = 1000;

  const handleIncrease = useCallback(() => setMultiplier(prev => prev + 1), []);
  const handleDecrease = useCallback(() => setMultiplier(prev => (prev > 1 ? prev - 1 : 1)), []);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
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

  return (
    <>
      {isLoggedIn ? <NavbarAfter /> : <Navbar />}

      <section className='sec-liveAuction'>
        <div className='div-live container py-2'>
          <div className='row'>

            <div className='col-7'>
              <div className='row row-count'>
                <h2 className='timeLess'>Time Remaining:</h2>
                <h3 className='timeCount'>{`${timeLeft.minutes} : ${timeLeft.seconds < 10 ? '0' : ''}${timeLeft.seconds}`}</h3>
              </div>

              <div className='row row-product'>
                <div className='div-pro'>
                  <img className='image-product' src={auctionData[0]?.imageUrl} alt="Product Image" />
                </div>
              </div>

              <div className='row row-extend'>
                <div className='div-extend'>
                  <h2 className='title-extend'>Renewal times: 1</h2>
                </div>
              </div>

              <div className='row row-infor1'>
                <div className='col-6 leftInfor'>
                  <h3 className='product-name'>{auctionData[0]?.name}</h3>
                </div>
                <div className='col-6 rightInfor'>
                  <h3 className='author-name'>{auctionData[0]?.description}</h3>
                </div>
              </div>

              <div className='row suggest py-3'>

                <div className="card" style={{ width: '200px' }}>
                  <img src="/gif-ne-2.gif" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some </p>
                  </div>
                </div>

                <div className="card" style={{ width: '200px' }}>
                  <img src="/gif-ne-2.gif" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some </p>
                  </div>
                </div>

                <div className="card" style={{ width: '200px' }}>
                  <img src="/gif-ne-2.gif" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some </p>
                  </div>
                </div>

              </div>
            </div>

            <div className='col-but col-5'>
              <div className='greenBox'>
                <div className='currentMoney-title'>
                  <DollarOutlined className='iconChart' />
                  <h2 className='title'>Current Price</h2>
                  <div className='currentPrice'>{highestPrice}$</div>
                </div>
                <hr className='divider' />
                <div className='inforPrice py-2'>
                  <Row className='price'>
                    <div className='priceField'>{price}$</div>
                    <div className="multiplySymbol">X</div>
                    <div className='multiplierField'>
                      <button onClick={handleDecrease} className='decreaseButton'>-</button>
                      {multiplier}
                      <button onClick={handleIncrease} className='increaseButton'>+</button>
                    </div>
                    <div className="equalSymbol">=</div>
                    <div className='totalField'>{price * multiplier}$</div>
                  </Row>
                  <div className='buttonPrice'>
                    <Button className='butPrice' type='primary'>Send {price * multiplier}$</Button>
                  </div>
                </div>
              </div>

              <div className='updateBox'>

                  <div className="update-card card">
                    <div className="card-header">
                      Đặt giá thành công!
                    </div>
                    <div className="body-noti card-body">
                        <div className='row'>
                          <div className='col-7'>
                            <h3 className='notification'>Bạn đã đặt giá: 1200$</h3>
                          </div>
                          <div className='div-time-noti col-5'>
                            <p className='time-noti'title="Source Title">10 : 35 : 30</p>
                          </div>
                        </div> 
                    </div>
                  </div>

                  <div className="update-card card">
                    <div className="card-header">
                      Đặt giá thành công!
                    </div>
                    <div className="body-noti card-body">
                        <div className='row'>
                          <div className='col-7'>
                            <h3 className='notification'>Bạn đã đặt giá: 1200$</h3>
                          </div>
                          <div className='div-time-noti col-5'>
                            <p className='time-noti'title="Source Title">10 : 35 : 30</p>
                          </div>
                        </div> 
                    </div>
                  </div>

                  <div className="update-card card">
                    <div className="card-header">
                      Đặt giá thành công!
                    </div>
                    <div className="body-noti card-body">
                        <div className='row'>
                          <div className='col-7'>
                            <h3 className='notification'>Bạn đã đặt giá: 1200$</h3>
                          </div>
                          <div className='div-time-noti col-5'>
                            <p className='time-noti'title="Source Title">10 : 35 : 30</p>
                          </div>
                        </div> 
                    </div>
                  </div>

                  <div className="update-card card">
                    <div className="card-header">
                      Đặt giá thành công!
                    </div>
                    <div className="body-noti card-body">
                        <div className='row'>
                          <div className='col-7'>
                            <h3 className='notification'>Bạn đã đặt giá: 1200$</h3>
                          </div>
                          <div className='div-time-noti col-5'>
                            <p className='time-noti'title="Source Title">10 : 35 : 30</p>
                          </div>
                        </div> 
                    </div>
                  </div>

                  <div className="update-card card">
                    <div className="card-header">
                      Đặt giá thành công!
                    </div>
                    <div className="body-noti card-body">
                        <div className='row'>
                          <div className='col-7'>
                            <h3 className='notification'>Bạn đã đặt giá: 1200$</h3>
                          </div>
                          <div className='div-time-noti col-5'>
                            <p className='time-noti'title="Source Title">10 : 35 : 30</p>
                          </div>
                        </div> 
                    </div>
                  </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
