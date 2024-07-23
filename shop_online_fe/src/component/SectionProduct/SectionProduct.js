import classNames from 'classnames/bind';
import 'rc-slider/assets/index.css';
import style from './SectionProduct.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
import FilterProduct from '../FilterProduct/FilterProduct';
const cx = classNames.bind(style)

function SectionProduct({ titleColor, category, products }) {
    const [isMobileDevice, setIsMobileDevice] = useState(true);

    useEffect(() => {
        if (window.matchMedia('(max-width: 740px)').matches) {
            setIsMobileDevice(true);

        } else {
            setIsMobileDevice(false);
        }

    }, [])
    return (
        <div className={cx('wrapper')}>

            {category !== null &&
                <div className={cx('section-title', {
                    'title-color-green': titleColor === 'green',
                    'title-color-pink': titleColor === 'pink'
                })}>
                    <h3 className={cx('title')}>{category.categoryName.toUpperCase()}</h3>
                    <div className={cx('more')}>
                        <a href="#" >Nhớt xe số</a>
                        <a href="#" >Nhớt xe tay ga</a>
                        <a href="#" >Nhớt Hộp Số</a>
                        <a href="#" >Xem thêm
                            <FontAwesomeIcon icon={faAngleRight} className={cx('icon')} />
                        </a>
                    </div>

                </div>
            }

            <div className={cx('section-content')}>
                {category !== null ?
                    <div className={cx('banner')}>
                        <div className={cx('banner-img')}>
                            <img src={category.categoryBannerUrl} alt="" />
                        </div>
                    </div> :
                    !isMobileDevice && <FilterProduct />
                }
                <div className={cx('products')}>
                    {(!category && !products) &&
                        <h3>Không có sản phẩm nào phù hợp</h3>
                    }
                    {(category === null ? products : category.products)?.map((product, index) => {
                        const imageUrl = product.image.url
                        const imageAlt = product.image.alt

                        return (
                            <Link to={`/product-detail?id=${product.id}`} className={cx('content-wrapper')} key={index}>
                                <div className={cx('box-image')}>
                                    <img src={imageUrl} alt={imageAlt} />
                                </div>
                                <div className={cx('box-text')}>
                                    <div className={cx('title-wrapper')}>
                                        <p> {category === null ? product.category.name : category.categoryName}</p>
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
                            </Link>
                        )
                    })}
                </div>

            </div>
        </div>




    );
}
export default memo(SectionProduct);
