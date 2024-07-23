import { useCallback, useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from './Cart.module.scss'

import ButtonComp from "../../component/ButtonComp";
import CheckBox from "../../component/CheckBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import CartService from "../../service/CartService";
import useDebounce from "../../hooks/useDebounce";
import { ModalConfirm, ModalLoading } from '../../layouts/component/Modal'
import { toast } from "react-toastify";
import { AuthenticationContext } from "../../context/AuthenticationProvider";
import OrdersService from "../../service/OrdersService";
const cx = classNames.bind(style);
function Cart() {
    const [carts, setCarts] = useState();
    const [totalPrice, setTotalPrice] = useState(0);
    const [updateItemProduct, setUpdateItemProduct] = useState({})
    const navigate = useNavigate();
    const debouncedUpdateItem = useDebounce(updateItemProduct, 800);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmParam, setConfirmParam] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);

    const { authentication } = useContext(AuthenticationContext)

    const handleQuantityChange = (id, value) => {
        setCarts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const numberValue = parseInt(value, 10);
                    const updatedItem = {
                        ...item,
                        quantity: value === ''
                            ? ''
                            : (!isNaN(numberValue)
                                ? Math.min(Math.max(numberValue, 1), item.productDetail.availableQuantity)
                                : item.quantity)
                    };
                    if (item.selected) {
                        setTotalPrice(totalPrice - (item.quantity * item.productDetail.price) + (updatedItem.quantity * updatedItem.productDetail.price))
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };


    const handleBlur = (id) => {
        setCarts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, quantity: item.quantity === '' ? 1 : item.quantity };
                    if (updatedItem.selected && updatedItem.quantity === 1) {
                        setTotalPrice(totalPrice - (item.quantity * item.price) + item.price)
                    }
                    setUpdateItemProduct(updatedItem);
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleDecreaseQuantity = (id) => {
        setCarts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, quantity: Math.max(item.quantity - 1, 1) };
                    console.log(Math.max(item.quantity - 1, 1));
                    console.log(updatedItem);
                    if (updatedItem.selected && item.quantity > 1) {
                        setTotalPrice(totalPrice - updatedItem.productDetail.price)
                    }

                    setUpdateItemProduct(updatedItem);
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleIncreaseQuantity = (id) => {
        setCarts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, quantity: Math.min(item.quantity + 1, item.productDetail.availableQuantity) };
                    if (updatedItem.selected && item.quantity < item.productDetail.availableQuantity) {
                        setTotalPrice(totalPrice + updatedItem.productDetail.price)
                    }
                    setUpdateItemProduct(updatedItem);
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleSelectChange = (id) => {
        setCarts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, selected: !item.selected };
                    if (updatedItem.selected) {
                        setTotalPrice(totalPrice + updatedItem.productDetail.price * updatedItem.quantity)
                    } else {
                        setTotalPrice(totalPrice - updatedItem.productDetail.price * updatedItem.quantity)

                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleRemoveProduct = (id) => {
        setShowConfirmModal(true)
        setConfirmParam(id)
    }

    const handleGetDeliveryFee = () => {
        setIsLoading(true)
        const data = {
            province: authentication.user.address.provinces.label,
            district: authentication.user.address.districts.label,
            ward: authentication.user.address.communes.label,
            address: authentication.user.address.addressDetail,
        }
        OrdersService.getDeliveryFee(data)
            .then(res => {
                setDeliveryFee(res.data.deliveryFee)
            }).catch(err => {
                console.log(err);
            }).finally(() => setIsLoading(false))
    }

    const handlePayment = () => {
        if (carts.filter((p) => p.selected).length === 0) {
            toast.warning("Vui lòng chọn sản phẩm muốn mua", { position: "top-center" })
            return;
        }
        const order = {
            carts: carts.filter((p) => p.selected),
            deliveryFee: deliveryFee,
            totalPrice: totalPrice
        }
        navigate('/payment', { state: order });
    }

    const getProductsInCart = () => {
        CartService.getProductsInCart()
            .then((res) => {
                if (res.status === 200) {
                    const updatedcart = res.data.map(item => ({
                        ...item,
                        selected: false
                    }));
                    setCarts(updatedcart);
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    const updateQuantity = (cartId, quantity) => {
        setIsLoading(true)
        CartService.updateQuantityProductInCart(cartId, quantity)
            .then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const removeProductInCart = useCallback((cartId) => {
        setIsLoading(true)
        CartService.removeProductFromCart(cartId)
            .then((res) => {
                if (res.status === 200) {
                    setCarts((prevcart) => {
                        const productToRemove = prevcart.find((item) => item.id === cartId);
                        if (!productToRemove) {
                            return prevcart;
                        }
                        if (productToRemove.selected) {
                            setTotalPrice(totalPrice - (productToRemove.productDetail.price * productToRemove.quantity));
                        }
                        return prevcart.filter((item) => item.id !== cartId);
                    });
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Có lỗi xảy ra vui lòng thử lại")
            }).finally(() => {
                setShowConfirmModal(false);
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        if (JSON.stringify(debouncedUpdateItem) === '{}') {
            return;
        }
        updateQuantity(debouncedUpdateItem.id, debouncedUpdateItem.quantity)
    }, [debouncedUpdateItem])

    useEffect(() => {
        getProductsInCart();
        handleGetDeliveryFee();
    }, [])
    return (
        <div className={cx('wrapper')}>
            <div className={cx('cart')}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th colSpan={3}>Sản Phẩm</th>
                            <th>Giá</th>
                            <th>Số Lượng</th>
                            <th>Tạm Tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts?.map((cart) => {
                            return (
                                <tr key={cart.id}>
                                    <td >
                                        <div className={cx('wrapper-icon')} onClick={() => handleSelectChange(cart.id)}>
                                            <CheckBox checked={cart.selected} />
                                        </div>
                                    </td>
                                    <td className={cx('col-img')}>
                                        <div className={cx('img-product')}>
                                            <img src={cart.productDetail.images[0].url} alt="product" />
                                        </div>
                                    </td>
                                    <td className={cx('product-info')}>

                                        <div>
                                            <a>{cart.productDetail.nameProduct}</a>
                                            <p>
                                                <span>
                                                    {cart.productDetail.color.nameColor && (
                                                        <>
                                                            - {cart.productDetail.color.nameColor} <br />
                                                        </>
                                                    )}
                                                    - {cart.productDetail.weight} KG
                                                </span>
                                            </p>
                                            <p className={cx('price-small')}>{cart.quantity} X <span>{cart.productDetail.price.toLocaleString('vi-VN')}VND</span></p>
                                        </div>
                                    </td>
                                    <td>
                                        <p className={cx('price')}>{cart.productDetail.price.toLocaleString('vi-VN') + 'VND'}</p>
                                    </td>
                                    <td style={{ width: '15%' }}>
                                        <div className={cx('quantity')}>
                                            <button onClick={() => handleDecreaseQuantity(cart.id)}>
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <input
                                                type="text"
                                                value={cart.quantity}
                                                onChange={(e) => handleQuantityChange(cart.id, e.target.value)}
                                                onBlur={() => handleBlur(cart.id)}
                                            />
                                            <button onClick={() => handleIncreaseQuantity(cart.id)}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                    </td>
                                    <td style={{ width: '18%' }}>
                                        <p className={cx('price')}>{(cart.productDetail.price * cart.quantity).toLocaleString('vi-VN')}<span>VND</span></p>
                                    </td>
                                    <td>
                                        <div
                                            className={cx('wrapper-icon')}
                                            onClick={() => handleRemoveProduct(cart.id)}
                                        >

                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>

                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
                <Link to='/product'>
                    <ButtonComp outline={true} cssClass={cx('back-to-product')}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Tiếp tục xem sản phẩm
                    </ButtonComp>
                </Link>

            </div>
            <div className={cx('action')}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th colSpan={2}>Giỏ hàng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <p className={cx('label')}>Tạm tính</p>
                            </td>
                            <td>
                                <p className={cx('price')}>{totalPrice.toLocaleString('vi-VN')} <span>VND</span></p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className={cx('label')}>Giao hàng</p>
                            </td>
                            <td>
                                <p className={cx('price')}>{deliveryFee.toLocaleString('vi-VN')} <span>VND</span></p>
                                <p className={cx('address ')}>Vận chuyển tới vị trí mặc định</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className={cx('label')}>Tổng</p>
                            </td>
                            <td>
                                <p className={cx('price')}>{(totalPrice + deliveryFee).toLocaleString('vi-VN')}<span>VND</span></p>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <ButtonComp onClick={handlePayment} cssClass={cx('btn-payment')}>TIẾN HÀNH THANH TOÁN</ButtonComp>
                <ModalConfirm
                    onClose={() => setShowConfirmModal(false)}
                    isOpen={showConfirmModal}
                    onConfirm={removeProductInCart}
                    confirmParam={confirmParam}
                    message={"Bỏ sản phẩm này khỏi giỏ hàng của bạn?"} />
                <ModalLoading isLoading={isLoading} />
            </div>
        </div>
    );
}

export default Cart;