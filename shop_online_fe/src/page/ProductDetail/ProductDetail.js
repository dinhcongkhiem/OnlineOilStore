import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { faMagnifyingGlassPlus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from './ProductDetail.module.scss'
import PropertiesSelect from "../../component/PropertiesSelect";
import ButtomComp from '../../component/ButtonComp'
import { Gallery, Item } from "react-photoswipe-gallery";
import 'photoswipe/dist/photoswipe.css';
import ProductService from "../../service/ProductService";
import CartService from "../../service/CartService";
import { ModalLoading } from '../../layouts/component/Modal'
import { toast } from "react-toastify";

const cx = classNames.bind(style)
function ProductDetail() {
    const [selectedPropOption, setSelectedPropOption] = useState({
        color: null,
        weight: null
    });
    const [product, setProduct] = useState();
    const [sameProducts, setSameProducts] = useState();
    const [quantity, setQuantity] = useState(1);
    const [listImg, setListImg] = useState();
    const [activeImg, setActiveImg] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProductDetail, setSelectedProductDetail] = useState();
    const openGalleryRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const currentId = new URLSearchParams(location.search).get('id')

    const fetchProductDetail = (id) => {
        ProductService.getProductDetail(id)
            .then((res) => {
                if (res.status === 200) {
                    fetchSameCategoryProduct(res.data.category.id, res.data.productId)
                    setProduct(res.data)
                    const listIMGFetch = res.data.productDetails.flatMap(productDetail =>
                        productDetail.images.map(image => ({
                            id: image.id,
                            url: image.url,
                            alt: image.alt
                        }))
                    )
                    console.log(listIMGFetch);
                    setListImg(Array.from(
                        listIMGFetch.reduce((map, obj) => map.set(obj.id, obj), new Map()).values()
                    ))
                }
            }).catch((err) => {
                console.log(err);
            })
    }
    const fetchSameCategoryProduct = (categoryId, productId) => {
        ProductService.getTheSameCategory(categoryId, productId)
            .then((res) => {
                if (res.status === 200) {
                    setSameProducts(res.data)
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleAddToCart = () => {
        const selectedProductDetail = product.productDetails.find(productDetail =>
            JSON.stringify(productDetail?.color) === JSON.stringify(selectedPropOption.color)
            && productDetail.weight === selectedPropOption.weight
        );
        const data = {
            quantity: quantity,
            productDetail: selectedProductDetail
        }
        if (selectedProductDetail === undefined) {
            toast.warning("Vui lòng chọn các tùy chọn của sản phẩm trước!", { position: "top-center" })
            return;
        }
        setIsLoading(true);
        CartService.addProductToCart(data)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Đã thêm sản phẩm vào giỏ hàng")
                    navigate('/cart')
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Có lỗi xảy ra vui lòng thử lại")
            }).finally(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        const selectedProductDetail = product?.productDetails.find(productDetail =>
            JSON.stringify(productDetail?.color) === JSON.stringify(selectedPropOption.color)
            && productDetail.weight === selectedPropOption.weight
        );
        if (selectedProductDetail !== undefined) {
            setSelectedProductDetail(selectedProductDetail)
        }

    }, [selectedPropOption]);

    const handleBuyNow = () => {
        const selectedProductDetail = product.productDetails.find(productDetail =>
            JSON.stringify(productDetail?.color) === JSON.stringify(selectedPropOption.color)
            && productDetail.weight === selectedPropOption.weight
        );

        if (selectedProductDetail === undefined) {
            toast.warning("Vui lòng chọn các tùy chọn của sản phẩm trước!", { position: "top-center" })
            return;
        }
        const cart = {
            quantity: quantity,
            productDetail: {...selectedProductDetail, nameProduct: product.name}
        }
        const order = {
            carts: [cart],
            totalPrice: selectedProductDetail.price * quantity
        }
        console.log(order);
        navigate('/payment', { state: order });
    }
    useEffect(() => {
        fetchProductDetail(currentId);
    }, [currentId])

    return (
        <div className={cx('wrapper')}>
            <div className={cx('breadcrumb')}>
                <h3>
                    <Link to="/">Trang chủ</Link> /
                    <Link to="/">Dầu động cơ</Link> /
                    <Link to='/'>Dầu nhớt xe máy</Link>
                </h3>
            </div>
            <div className={cx('product-info')}>
                <div className={cx('product-img')}>
                    <ul className={cx('list-img')}>
                        {listImg?.map((img, index) => {
                            return (
                                <li onClick={() => setActiveImg(index)} key={index}>
                                    <img src={img.url} alt={img.alt} className={cx({ 'active-img': activeImg === index })} />
                                </li>
                            )
                        })}


                    </ul>
                    <div className={cx('current-img')}>
                        {listImg &&
                            <img src={listImg[activeImg].url} alt={listImg[activeImg].alt}
                                onClick={() => openGalleryRef.current && openGalleryRef.current()} />
                        }
                        <Gallery>
                            {
                                listImg?.map((img, index) => (
                                    <Item
                                        key={index}
                                        original={img.url}
                                        thumbnail={img.url}
                                        width="1600"
                                        height="1600"
                                    >
                                        {({ ref, open }) => {
                                            if (index === activeImg) {
                                                openGalleryRef.current = open;
                                            }
                                            return <img ref={ref} onClick={open} src={img.url} alt={img.alt} />;
                                        }}
                                    </Item>
                                ))}
                        </Gallery>
                        <FontAwesomeIcon icon={faMagnifyingGlassPlus}
                            onClick={() => openGalleryRef.current && openGalleryRef.current()} />
                    </div>
                </div>
                <div className={cx('action-wrapper')}>
                    <h2 className={cx('name-product')}>{product?.name}</h2>
                    <h1 className={cx('price')}>
                        {selectedProductDetail !== undefined ?
                            selectedProductDetail.price.toLocaleString('vi-VN') :
                            product?.productDetails[0]?.price.toLocaleString('vi-VN')
                        } <span>VND</span></h1>
                    <div className={cx('action')}>
                        <PropertiesSelect
                            productDetails={product?.productDetails}
                            selectedOptions={selectedPropOption}
                            setSelectedOptions={setSelectedPropOption} />
                        <div className={cx('quantity')}>
                            <p className={cx('label')}>Số lượng</p>
                            <div>
                                <button onClick={() => setQuantity(qty => Math.max(1, qty - 1))}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                                <input type="text" value={quantity}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '') {
                                            setQuantity('');
                                        } else {
                                            const numberValue = parseInt(value, 10);
                                            if (!isNaN(numberValue)) {
                                                setQuantity(Math.min(Math.max(numberValue, 1), product?.availableQuantity));
                                            }
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === '') {
                                            setQuantity(1);
                                        }
                                    }} />
                                <button onClick={() => setQuantity(qty => Math.min(product?.availableQuantity, qty + 1))}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                                <span>{product?.availableQuantity} sản phẩm có sẵn</span>
                            </div>
                        </div>
                        <div className={cx('btn-action')}>
                            <ButtomComp outline={true} onClick={handleAddToCart}>Thêm vào giỏ hàng</ButtomComp>
                            <ButtomComp onClick={handleBuyNow}>Mua ngay</ButtomComp>
                        </div>
                    </div>

                </div>
            </div>
            <h3 className={cx('title')}>Mô tả</h3>
            <div className={cx('product-description')}>
                <p>
                    <span className={cx('title-desc')} style={{ color: '#008000' }}><strong>1. Trạng thái:</strong></span>
                    <br />
                    <span dangerouslySetInnerHTML={{ __html: product?.description.state }}></span>
                    <br />
                    <span className={cx('title-desc')} style={{ color: '#008000' }}><strong>2. Thành phần:</strong></span><br />
                    <span dangerouslySetInnerHTML={{ __html: product?.description.ingredients }}></span>
                    <br />
                    <span className={cx('title-desc')} style={{ color: '#008000' }}><strong>3. Tiêu chuẩn kĩ thuật:</strong></span><br />
                    <span style={{ color: '#ff0000' }}>
                        <strong dangerouslySetInnerHTML={{ __html: product?.description.technical_standards }}></strong>
                    </span>
                    <br />
                    <span className={cx('title-desc')} style={{ color: '#008000' }}><strong>4. Vai trò:</strong></span><br />
                    <span dangerouslySetInnerHTML={{ __html: product?.description.role }} />
                    <br />
                    <span className={cx('title-desc')} style={{ color: '#008000' }}><strong>5. Ứng dụng:</strong></span><br />
                    <span dangerouslySetInnerHTML={{ __html: product?.description.applications }}></span>
                    <br />
                    <span className={cx('title-desc')} style={{ color: '#008000' }}><strong>6. An toàn khi sử dụng:</strong></span><br />
                    <span dangerouslySetInnerHTML={{ __html: product?.description.safety }}></span>
                    <br />
                    <span className={cx('title-desc')} style={{ color: '#008000' }}><strong>7. Bảo quản:</strong></span><br />
                    <span dangerouslySetInnerHTML={{ __html: product?.description.storage }}></span>
                </p>
            </div>
            <h3 className={cx('title')}>Sản phẩm tương tự</h3>
            <div className={cx('same-products')}>
                {sameProducts?.map((product, index) => {
                    return (
                        <Link to={`/product-detail?id=${product.id}`} className={cx('content-wrapper')} key={index}>
                            <div className={cx('box-image')}>
                                <img src={product.image.url} alt="" />
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
                                    }                                </div>

                            </div>
                        </Link>
                    )
                })}
            </div>

            <ModalLoading isLoading={isLoading} />

        </div>
    );
}

export default ProductDetail;
