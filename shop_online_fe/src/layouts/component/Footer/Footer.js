import classNames from "classnames/bind";
import style from './Footer.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);
function Footer() {
    const [active, setActive] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
      
            if (scrollPercent >= 10) {
              setActive(true);
            }else {
              setActive(false);

            }
          };
      
          window.addEventListener('scroll', handleScroll);
          return () => {
            window.removeEventListener('scroll', handleScroll);
          };
        }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('about')}>
                <div className={cx('about-content')}>
                    <div>
                        <h4 className={cx('title')}>VỀ NPOIL</h4>
                        <ul>
                            <li>
                                <a href="">Phiếu mua hàng</a>
                            </li>
                            <li>
                                <a href="">Giới thiệu Npoil</a>
                            </li>
                            <li>
                                <a href="">Tuyển dụng</a>
                            </li>
                            <li>
                                <a href="">Liên hệ</a>
                            </li>
                        </ul>
                        <div className={cx('logoSaleNoti')}>
                            <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2019/02/logoSaleNoti-1.png" alt="" />
                        </div>
                    </div>

                    <div>
                        <h4 className={cx('title')}>Hỗ trợ khách hàng</h4>
                        <ul>
                            <li>
                                <p>Hotline: 1900 75 75 25</p>
                            </li>
                            <li>
                                <p>(8-20h kể cả T7, CN)</p>
                            </li>
                            <li>
                                <a href="">Hướng dẫn mua hàng</a>
                            </li>
                            <li>
                                <a href="">Phương thức thanh toán</a>
                            </li>
                            <li>
                                <a href="">Phương thức vận chuyển</a>
                            </li>
                            <li>
                                <a href="">Chính sách bảo mật</a>
                            </li>
                            <li>
                                <a href="">Chính sách bảo hành - đổi trả</a>
                            </li>
                            <li>
                                <a href="">Chính sách kiểm hàng</a>
                            </li>
                        </ul>

                    </div>

                    <div>
                        <h4 className={cx('title')}>Hợp tác & liên kết</h4>
                        <ul>
                            <li>
                                <a href="">Updating</a>
                            </li>
                            <li>
                                <a href="">Updating</a>
                            </li>
                        </ul>
                        <h4 className={cx('title')}>ZALO oa npoil</h4>

                        <div className={cx('qrZalo')}>
                            <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2023/09/5aed2fce188bf1d5a89a.jpg" alt="" />
                        </div>
                    </div>

                </div>
                <div>
                    <h4 className={cx('title')}>VỀ NPOIL</h4>
                    {/* <p>
                        <iframe
                            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fdaunhonnpoil%2F&amp;tabs=timeline&amp;width=340&amp;height=200&amp;small_header=false&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId"
                            width="340" height="200" style={{ border: 'none', overflow: 'hidden' }}
                            scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>

                            

                    </p> */}
                </div>
            </div>
            <div className={cx('information')}>
                <p>
                    CÔNG TY CỔ PHẦN NPOIL
                    <br />
                    Giấy CNĐKKD số: 0311530345 cấp ngày 10/02/2012
                    <br />
                    Văn phòng: Số 14 đường DD12, Phường Tân Hưng Thuận, Quận 12, TP.HCM
                    <br />
                    Điện thoại: ( 028 ) 54 270 270 - 1900 75 75 25
                    <br />
                    Email: salesadmin@npoil.com.vn
                </p>
            </div>
            <div className={cx('absolute-footer')}>
                <a href="">Dầu Nhớt NPOIL</a>
                <p>Hotline kỹ thuật: 1900 75 75 25</p>
            </div>

            <div className={cx('float-btn',{'active': active})} onClick={() => {
                window.scroll({
                    top: 0,
                })
            }}>
                <FontAwesomeIcon icon={faChevronUp} />
            </div>
        </div>
    );
}

export default Footer;