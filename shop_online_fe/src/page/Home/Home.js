import classNames from 'classnames/bind';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import SectionProduct from '../../component/SectionProduct';

import styles from './Home.module.scss'
import { useEffect, useState } from 'react';
import ProductService from '../../service/ProductService';
const cx = classNames.bind(styles);


function Home() {
    const imgSlide = [
        "https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/DAU.png",
        "https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/dau-4.png",
        "https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/dau-dong-co.png",
    ]
    const [hotDealProduct, setHotDealProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [slidesToShowProduct, setSlideToShowProduct] = useState(6)

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    const settingsHotDeal = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShowProduct,
        slidesToScroll: slidesToShowProduct - 1,
        autoplaySpeed: 1800,
        slickNext: true,
        arrows: true
    };

    const fetchHotDeal = () => {
        ProductService.getHotDealProduct()
            .then((response) => {
                if (response.status === 200) {
                    setHotDealProduct(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const fetchTopCategory = () => {
        ProductService.getTopCategory()
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    setCategories(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {
        fetchHotDeal();
        fetchTopCategory();
        const handleScroll = () => {
            if (window.matchMedia('(max-width: 740px)').matches) {
                setSlideToShowProduct(2);
            } else if (window.matchMedia('(max-width: 840px)').matches) {
                setSlideToShowProduct(4);
            } else if (window.matchMedia('(min-width: 841px)').matches) {
                setSlideToShowProduct(6);

            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [])
    return (
        <div className={cx('wrapper')}>
            <div className={cx('section-heading')}>

                <div className={cx('hidden-block')}></div>
                <div className={cx('middle-block')}>
                    <div className={cx('slider')}>
                        <Slider {...settings}>
                            {imgSlide.map((img, index) => {
                                return (
                                    <div key={index}>
                                        <img src={img} alt={`slider ${index}`} />
                                    </div>
                                )

                            })}
                        </Slider>
                    </div>
                    <div className={cx('cooperate')}>
                        <div><img src="https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/HOP-TAC-PHAN-PHOI.png" style={{ width: '100%', height: '100%' }} alt="cooperate" /></div>
                        <div><img src="https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/HOP-TAC-PHAN-PHOI.png" style={{ width: '100%', height: '100%' }} alt="cooperate" /></div>
                    </div>
                </div>
                <div className={cx('right-block')}>
                    <div className={cx('title')}>
                        <h3>
                            <b></b>
                            <span>Chất lượng cho tất cả</span>
                            <b></b>
                        </h3>
                    </div>
                    <div className={cx('content')}>
                        <div className={cx('content-wrapper')}>
                            <div>
                                <div className={cx('icon')}>
                                    <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2019/02/4.png" alt="" />
                                </div>
                                <p>Sản xuất theo công nghệ mỹ</p>
                            </div>
                            <div>
                                <div className={cx('icon')}>
                                    <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2019/02/4.png" alt="" />
                                </div>
                                <p>Sản xuất theo công nghệ mỹ</p>
                            </div>
                        </div>
                        <div className={cx('content-wrapper')}>
                            <div>
                                <div className={cx('icon')}>
                                    <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2019/02/4.png" alt="" />
                                </div>
                                <p>Sản xuất theo công nghệ mỹ</p>
                            </div>
                            <div>
                                <div className={cx('icon')}>
                                    <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2019/02/4.png" alt="" />
                                </div>
                                <p>Sản xuất theo công nghệ mỹ</p>
                            </div>
                        </div>



                    </div>
                    <div className={cx('contact')}>

                        <div className={cx('icon')}>
                            <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2019/02/img_hotline.png" alt="contact-icon" />
                        </div>
                        <div className={cx('content')}>
                            <p>
                                <span>
                                    Dịch vụ CSKH chu đáo&nbsp;
                                </span>
                                <br />
                                <span>
                                    Hotline:&nbsp;
                                    <span>
                                        <b>1900 75 75 25</b>
                                    </span>
                                </span></p>
                        </div>
                    </div>
                </div>

            </div>

            <div className={cx('hotdeal-section')}>
                <div className={cx('section-title')}>
                    <h3 className={cx('title')}>DEAL HOT ĐANG DIỄN RA</h3>
                    <a href="" className={cx('more')}>
                        Xem thêm
                        <FontAwesomeIcon icon={faAngleRight} className={cx('icon')} />
                    </a>
                </div>
                <div className={cx('section-content')}>
                    <Slider {...settingsHotDeal}>
                        {hotDealProduct.map((product) => {
                            return (
                                <Link to={`/product-detail?id=${product.id}`} key={product.id}>
                                    <div className={cx('content-wrapper')} >
                                        <div className={cx('box-image')}>
                                            <img src={product.image.url} alt={product.image.alt} />
                                        </div>
                                        <div className={cx('box-text')}>
                                            <div className={cx('title-wrapper')}>
                                                <p>{product.category.name}</p>
                                                <p>{product.name}</p>
                                            </div>
                                            <div className={cx('price-wrapper')}>
                                                {
                                                    product.minPrice === product.maxPrice ?
                                                        <span>{product.minPrice.toLocaleString('vi-VN')}VND </span> :
                                                        <span>{product.minPrice.toLocaleString('vi-VN')}VND - {product.maxPrice.toLocaleString('vi-VN')}VND</span>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </Slider>
                </div>
            </div>

            {categories.map((category, index) => {
                return <SectionProduct titleColor={category.nameCategory} category={category} key={index} />

            })}


        </div>
    )
}

export default Home;
