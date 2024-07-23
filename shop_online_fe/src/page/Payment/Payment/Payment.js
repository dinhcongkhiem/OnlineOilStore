import { useContext, useEffect, useState } from 'react'
import classNames from "classnames/bind";
import Tippy from '@tippyjs/react';
import Select from 'react-select'

import Input from '../../../component/Input'
import ButtonComp from '../../../component/ButtonComp'
import CheckBox from '../../../component/CheckBox'

import DataAddress from '../../../service/Address'
import style from './Payment.module.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { validateInputPayment } from '../../../utills/ValidateInputs';
import OrdersService from '../../../service/OrdersService';
import { AuthenticationContext } from '../../../context/AuthenticationProvider'
import { ModalLoading } from '../../../layouts/component/Modal';

const cx = classNames.bind(style);
function Payment() {
    const { authentication } = useContext(AuthenticationContext);
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state;
    const [loading, setLoading] = useState(false);

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [address, setAddress] = useState();
    const [note, setNote] = useState('');

    const [provincesOptions, setProvincesOptions] = useState();
    const [districtsOptions, setDistrictsOptions] = useState();
    const [communesOptions, setCommunesOptions] = useState();

    const [deliveryFee, setDelivery] = useState(1);
    const [listErr, setListErr] = useState({
        email: false,
        emailFormat: false,
        fullname: false,

        provinces: false,
        districts: false,
        communes: false,
        addressDetail: false
    });

    const [paymentType, setPaymentType] = useState(1);

    const loadDataOptions = (type, id) => {
        DataAddress.getDataAddress(type, id)
            .then(options => {
                if (type === 1) {
                    setProvincesOptions(options);
                } else if (type === 2) {
                    setDistrictsOptions(options);
                } else {
                    setCommunesOptions(options);
                }
            })
            .catch(error => {
                console.error('Error processing data: ', error);
            });
    };
    const handleChangeOptions = (value, type) => {
        !(type === 3) && loadDataOptions(type + 1, value.value);

        if (type === 1) {
            setAddress(prev => ({
                ...prev,
                provinces: value,
            }))

        } else if (type === 2) {
            setAddress(prev => ({
                ...prev,
                districts: value,
            }))
        } else {
            setAddress(prev => ({
                ...prev,
                communes: value,
            }))
            setTimeout(() => {
                handleGetDeliveryFee(address)
            },800)
        }
    }

    const handlePayment = () => {
        if (validateInputPayment(
            listErr,
            {
                email, fullname, phoneNum,
                provinces: address.provinces, districts: address.districts, communes: address.communes,
                addressDetail: address.addressDetail
            }, setListErr)) {

            const orderToSave = {
                address: address,
                paymentType: paymentType,
                carts: order.carts,
                deliveryFee: deliveryFee,
                buyer: {
                    fullName:fullname,
                    email: email,
                    phoneNum: phoneNum
                },
                note: note
            }

            OrdersService.createOrder(orderToSave)
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        navigate('/payment-detail', { state: res.data, replace: true });
                    }
                }).catch(err => {
                    console.log(err);
                })

        };
    }
    const handleGetDeliveryFee = (address) => {
        if (address) {
            const data = {
                province: address?.provinces.label,
                district: address?.districts.label,
                ward: address?.communes.label,
                address: address?.addressDetail,
            }
        setLoading(true)

            OrdersService.getDeliveryFee(data)
                .then(res => {
                    setDelivery(res.data.deliveryFee)
                }).catch(err => {
                    console.log(err);
                }).finally(() => setLoading(false))
        }

    }

    useEffect(() => {
        setFullname(authentication.user.fullName);
        setEmail(authentication.user.email)
        setPhoneNum(authentication.user.phoneNum)
        setAddress(prev => ({
            ...prev,
            provinces: authentication.user.address.provinces,
            districts: authentication.user.address.districts,
            communes: authentication.user.address.communes,
            addressDetail: authentication.user.address.addressDetail,
        }))

        if (order.deliveryFee) {
            setDelivery(order.deliveryFee);
        }else {
            handleGetDeliveryFee( authentication.user.address)
        }
        loadDataOptions(1, 0);
        loadDataOptions(2, authentication.user.address.provinces.value);
        loadDataOptions(3, authentication.user.address.districts.value);

        if (!order) {
            navigate('/cart');
        }
        console.log(order);
    }, [order]);

    if (!order) {
        return null;
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('payment-info')}>
                <h3>Thông tin thanh toán</h3>
                <div className={cx('form')}>
                    <div className={cx('input-wrapper')}>
                        <label>Họ tên</label>
                        <Input
                            zIndex={1002}
                            value={fullname}
                            setValue={setFullname}
                            err={listErr.fullname}
                            placeholder="Họ tên"
                            placementTooltip='top-end' />
                    </div>
                    <div className={cx('row')}>
                        <div className={cx('input-wrapper')} style={{ flex: 1 }}>
                            <label>Email</label>
                            <Input
                                zIndex={1002}
                                value={email}
                                setValue={setEmail}
                                errContent={listErr.emailFormat ? 'Vui lòng nhập đúng định dạng email' : ''}
                                err={!listErr.email ? listErr.emailFormat : listErr.email}
                                placeholder="Email"
                                placementTooltip='top-end' />
                        </div>
                        <div className={cx('input-wrapper')} style={{ flexBasis: '35%' }}>
                            <label>Số điện thoại</label>
                            <Input
                                zIndex={1002}
                                value={phoneNum}
                                setValue={setPhoneNum}
                                err={listErr.phoneNum}
                                placeholder="Số điện thoại"
                                placementTooltip='top-end' />

                        </div>
                    </div>

                    <Tippy content={`Vui lòng nhập đầy đủ địa chỉ`}
                        className={cx('tooltip-address')} arrow={false}
                        visible={(listErr.provinces || listErr.districts || listErr.communes || listErr.addressDetail)}
                        placement="top-end">
                        <div className={cx('row')}>
                            <div className={cx('input-wrapper')} style={{ flexBasis: '33.333%' }}>
                                <label>Địa chỉ</label>
                                <Select
                                    options={provincesOptions}
                                    value={address?.provinces}
                                    onChange={(value) => handleChangeOptions(value, 1)}
                                    placeholder="Tỉnh..."
                                    className={cx({ 'err-select-address': listErr.provinces })}
                                />
                            </div>
                            <div className={cx('input-wrapper')} style={{ flexBasis: '33.333%' }}>
                                <Select
                                    options={districtsOptions}
                                    value={address?.districts}
                                    onChange={(value) => handleChangeOptions(value, 2)}
                                    placeholder="Huyện.."
                                    isDisabled={!address?.provinces}
                                    className={cx({ 'err-select-address': listErr.districts })}

                                />
                            </div>
                            <div className={cx('input-wrapper')} style={{ flexBasis: '33.333%' }}>
                                <Select
                                    options={communesOptions}
                                    value={address?.communes}
                                    onChange={(value) => handleChangeOptions(value, 3)}
                                    placeholder="Xã..."
                                    isDisabled={!address?.districts}
                                    className={cx({ 'err-select-address': listErr.communes })}
                                />
                            </div>
                        </div>

                    </Tippy>
                    <div className={cx('input-wrapper')}>
                        <Input
                            zIndex={1002}
                            value={address?.addressDetail || ''}
                            setValue={(value) => setAddress((prev) => ({ ...prev, addressDetail: value }))}
                            err={listErr.addressDetail}
                            errContent={null}
                            placeholder="Địa chỉ cụ thể"
                            placementTooltip='top-end' />
                    </div>

                    <div className={cx('input-wrapper')}>
                        <label>Ghi chú</label>
                        <Input
                            CssClass={cx('textarea')}
                            type={'textarea'}
                            zIndex={1002}
                            value={note}
                            setValue={setNote}
                            placeholder="Ghi chú về đơn hàng"
                            placementTooltip='top-end' />
                    </div>

                </div>
            </div>
            <div className={cx('order')}>
                <h3>Đơn hàng của bạn</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>SẢN PHẨM</th>
                            <th>TẠM TÍNH</th>

                        </tr>
                    </thead>
                    <tbody>
                        {order.carts.map((cart, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <p className={cx('name-cart')}>{cart.productDetail.nameProduct}
                                            <span style={{ fontWeight: 700 }}> × {cart.quantity} </span>
                                            <br />
                                            {cart.selectedAttribute?.length > 0 && (
                                                <span style={{ color: '#666666', marginLeft: '1rem' }}>  (
                                                    {cart.selectedAttribute.map((attr, index) => (
                                                        <span key={index}>
                                                            {index > 0 && ' - '}
                                                            {attr.value}
                                                        </span>
                                                    ))}
                                                    )
                                                </span>
                                            )}



                                        </p>
                                    </td>
                                    <td>
                                        <p className={cx('price')}>{(cart.productDetail.price * cart.quantity).toLocaleString('vi-VN')}<span>VND</span></p>
                                    </td>
                                </tr>
                            )
                        })}


                        <tr>
                            <td>
                                <p className={cx('label')}>Tạm tính</p>
                            </td>
                            <td>
                                <p className={cx('price')}>{order.totalPrice.toLocaleString('vi-VN')}<span>VND</span></p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className={cx('label')}>Giao hàng</p>
                            </td>
                            <td>
                                <p className={cx('price')}>
                                    {deliveryFee.toLocaleString('vi-VN')}VND
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className={cx('label')}>Tổng</p>
                            </td>
                            <td>
                                <p className={cx('price')}>{(order.totalPrice + deliveryFee).toLocaleString('vi-VN')}<span>VND</span></p>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={cx('checkbox-type-payment')} onClick={() => setPaymentType(1)}>
                                    <CheckBox checked={paymentType === 1} />
                                    <p className={cx('type-payment', 'label')}>Chuyển khoản ngân hàng</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={cx('checkbox-type-payment')} onClick={() => setPaymentType(0)}>
                                    <CheckBox checked={paymentType === 0} />
                                    <p className={cx('type-payment', 'label')}>Tiền mặt</p>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <ButtonComp cssClass={cx('button-order')} onClick={handlePayment}>Đặt hàng</ButtonComp>
            </div>
            <ModalLoading isLoading={loading}/>
        </div>
    );
}

export default Payment;