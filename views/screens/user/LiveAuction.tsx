'use client'

import React, { useEffect, useState, useCallback } from 'react';
import "@/views/style/LiveAuction.css";
import NavbarSI from '@/views/components/NavbarSI';
import { Col, Row, Card, Avatar, Button, Switch } from 'antd';
import { DollarOutlined, EditOutlined, EllipsisOutlined, LineChartOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import classNames from 'classnames';
import Navbar from '@/views/components/Navbar';
import NavbarAfter from '@/views/components/NavbarAfter';

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

  useEffect(() => {
    const cardInterval = setInterval(() => {
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        const firstCard = updatedCards.shift();
        if (firstCard) {
          updatedCards.push({ ...firstCard, topCard: false });
          updatedCards[0].topCard = true;
        }
        return updatedCards;
      });
    }, 2000);

    const countdownInterval = setInterval(() => {
      setCountdown(prevCountdown => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(cardInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const price = 1000;
  const currentPrice = 1000;
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

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
                <h3 className='timeCount'>{`${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`}</h3>
              </div>

              <div className='row row-product'>
                <div className='div-pro'>
                  <img className='image-product' src='/gif-12-CartoonHangover.gif' />
                </div>
              </div>

              <div className='row row-extend'>
                <div className='div-extend'>
                  <h2 className='title-extend'>Renewal times: 1</h2>
                </div>
              </div>

              <div className='row row-infor1'>
                <div className='col-6 leftInfor'>
                  <h3 className='product-name'>Product name</h3>
                </div>
                <div className='col-6 rightInfor'>
                  <h3 className='author-name'>Author name</h3>
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

            <div className='col-5'>
              <div className='redBox'>
                <div className='liveMoney-title'>
                  <LineChartOutlined className='iconChart' />
                  <h2 className='title'>Auction Progress</h2>
                </div>
                <div className='content'>
                  {cards.slice(0, 6).map(card => (
                    <Card className={classNames('auctionCard', { topCard: card.topCard })} key={card.id}>
                      <Row className='rowCard'>
                        <Col className='colMoney' span={8}>
                          <div className='moneyAtime'>
                            <p className={classNames('price', { highlightPrice: card.topCard })}>{card.price}$</p>
                            <p>{card.time}</p>
                          </div>
                        </Col>
                        <Col className='colRound' span={8}>
                          <div className='round'>
                            Vòng đấu {card.round}
                          </div>
                        </Col>
                        <Col className='colUser' span={8}>
                          <div className='user'>
                            <Avatar icon={<UserOutlined />} className="navbar-iconStyle" />
                            <span className={classNames('userName', { highlightUserName: card.topCard })}>{card.user}</span>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              </div>

              <div className='greenBox'>
                <div className='currentMoney-title'>
                  <DollarOutlined className='iconChart' />
                  <h2 className='title'>Current Price</h2>
                  <div className='currentPrice'>{currentPrice}$</div>
                </div>
                <hr className='divider' />
                <div className='inforPrice'>
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
            </div>

          </div>
        </div>
      </section>

      {/*==========================================*/}
      {/* <div className='liveAuction'>
        <Row>
          <Col className='time' span={12}>
            <div className='countDown'>
              <Row className='rowCount'>
                <div className='showTime'>
                  <span className='timeLess'>Time Remaining:</span>
                  <span className='timeCount'>{`${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`}</span>
                </div>
              </Row>
            </div>
            <div className='product'>
              <Avatar shape='square' src="/gif-ne-2.gif" className="avatar" />
            </div>
            <div className='inforProduct'>
              <Row className='infor1'>
                <div className='inforRound'>
                  Renewal times: 1
                </div>
              </Row>
              <Row className='infor2'>
                <div className='leftInfor'>
                  Product name
                </div>
                <div className='rightInfor'>
                  Author name
                </div>
              </Row>
            </div>
            <div className='moreProduct'>
              <div className='suggest1'>
                <Card className='cardSug1' hoverable style={{ minWidth: 300 }}>
                  <Card.Meta
                    className='inforSugPro1'
                    avatar={<Avatar className='avtSug' src="/gif-ne-3.gif" />}
                    description={
                      <>
                        <p>Current Price: <span className='priceSugPro'>50$</span></p>
                        <p>Price paid: <span className='priceSugPro'>500$</span></p>
                        <div className='bidCount'>
                          <p>Bid count: <span className='priceSugPro'>5</span></p>
                        </div>
                      </>
                    }
                  />
                </Card>
              </div>
              <div className='suggest2'>
                <Card className='cardSug1' hoverable style={{ minWidth: 300 }}>
                  <Card.Meta
                    className='inforSugPro1'
                    avatar={<Avatar className='avtSug' src="/gif-ne-4.gif" />}
                    description={
                      <>
                        <p>Current Price: <span className='priceSugPro'>50$</span></p>
                        <p>Price paid: <span className='priceSugPro'>500$</span></p>
                        <div className='bidCount'>
                          <p>Bid count: <span className='priceSugPro'>5</span></p>
                        </div>
                      </>
                    }
                  />
                </Card>
              </div>
            </div>
          </Col>

          <Col className='money' span={12}>
            <div className='redBox'>
              <div className='liveMoney-title'>
                <LineChartOutlined className='iconChart' />
                <h2 className='title'>Auction Progress</h2>
              </div>
              <div className='content'>
                {cards.slice(0, 6).map(card => (
                  <Card className={classNames('auctionCard', { topCard: card.topCard })} key={card.id}>
                    <Row className='rowCard'>
                      <Col className='colMoney' span={8}>
                        <div className='moneyAtime'>
                          <p className={classNames('price', { highlightPrice: card.topCard })}>{card.price}$</p>
                          <p>{card.time}</p>
                        </div>
                      </Col>
                      <Col className='colRound' span={8}>
                        <div className='round'>
                          Vòng đấu {card.round}
                        </div>
                      </Col>
                      <Col className='colUser' span={8}>
                        <div className='user'>
                          <Avatar icon={<UserOutlined />} className="navbar-iconStyle" />
                          <span className={classNames('userName', { highlightUserName: card.topCard })}>{card.user}</span>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </div>

            <div className='greenBox'>
              <div className='currentMoney-title'>
                <DollarOutlined className='iconChart' />
                <h2 className='title'>Current Price</h2>
                <div className='currentPrice'>{currentPrice}$</div>
              </div>
              <hr className='divider' />
              <div className='inforPrice'>
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

          </Col>
        </Row>
      </div> */}
    </>


  );
}
