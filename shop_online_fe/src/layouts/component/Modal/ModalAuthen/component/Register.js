import classNames from "classnames/bind"
import PropTypes from 'prop-types';
import Select from 'react-select'

import { memo, useEffect, useState } from "react";
import style from '../ModalAuthen.module.scss'
import Input from '../../../../../component/Input'
import ButtonComp from '../../../../../component/ButtonComp'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import DataAddress from "../../../../../service/Address";
import Tippy from "@tippyjs/react";
import { validateInputsRegister } from "../../../../../utills/ValidateInputs";
import AuthenticationService from "../../../../../service/AuthenticationService";
import ModalLoading from '../../ModalLoading/ModalLoading'
import { toast } from "react-toastify";

const cx = classNames.bind(style);

const Register = ({ handleClose, changeLayout }) => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [provinces, setProvinces] = useState();
    const [districts, setDistricts] = useState();
    const [communes, setCommunes] = useState();
    const [addressDetail, setAddressDetail] = useState('');
    const [provincesOptions, setProvincesOptions] = useState();
    const [districtsOptions, setDistrictsOptions] = useState();
    const [communesOptions, setCommunesOptions] = useState();
    const [listErr, setListErr] = useState({
        email: false,
        emailFormat: false,
        password: false,
        fullname: false,
        confirmPassword: {
            required: false,
            match: false
        },
        provinces: false,
        districts: false,
        communes: false,
        addressDetail: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    useEffect(() => {
        loadDataOptions(1, 0);
        if (window.matchMedia('(max-width: 740px)').matches) {
            setIsMobileDevice(true);

        } else {
            setIsMobileDevice(false);
        }
    }, [])
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
            setProvinces(value);
        } else if (type === 2) {
            setDistricts(value)
        } else {
            setCommunes(value)
        }

    }


    const handleRegister = () => {
        if (validateInputsRegister(
            listErr,
            {
                email, fullname, phoneNum, password, confirmPassword,
                provinces, districts, communes,
                addressDetail
            }, setListErr)) {
            setIsLoading(true);
            const data = {
                userName: fullname,
                email,
                password, phoneNum,
                address: {
                    provinces, districts, communes, addressDetail
                },
                password
            }
            AuthenticationService.register(data)
                .then((response) => {
                    toast.success("Vui lòng kiểm tra email để kích hoạt tài khoản")
                    handleClose();
                    setIsLoading(false);

                })
                .catch((error) => {
                    console.log(error.response);
                    if (error.response.status === 400) {
                        toast.error("Email này đã tồn tại")
                    }
                    handleClose();
                });


        }
    };


    return (
        <div className={cx('content')}>
            <FontAwesomeIcon icon={faXmark} className={cx('close-icon')} onClick={handleClose} />
            <Link to='/' className={cx('logo')}>
                <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/logo-dau-nhot-npoil-new-1024x315.png" alt="Logo" />
            </Link>
            <div className={cx('title')}>
                <h2>Đăng ký</h2>
            </div>
            <div className={cx('form')}>
                <div className={cx('input-wrapper')}>
                    <label>Họ tên</label>
                    <Input
                        zIndex={1002}
                        value={fullname}
                        setValue={setFullname}
                        err={listErr.fullname}
                        placeholder="Họ tên"
                        placementTooltip='right-start' />
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
                            placementTooltip='left-start' />
                    </div>
                    <div className={cx('input-wrapper')} style={{ flexBasis: '30%' }}>
                        <label>Số điện thoại</label>
                        <Input
                            zIndex={1002}
                            value={phoneNum}
                            setValue={setPhoneNum}
                            err={listErr.phoneNum}
                            placeholder="Số điện thoại"
                            placementTooltip='right-start' />

                    </div>
                </div>

                <Tippy content={`Vui lòng nhập đầy đủ địa chỉ`}
                    className={cx('tooltip-address')} arrow={false}
                    visible={(listErr.provinces || listErr.districts || listErr.communes || listErr.addressDetail) && !isMobileDevice}
                    placement="right">
                    <div className={cx('row')}>
                        <div className={cx('input-wrapper')} style={{ flexBasis: '33.333%' }}>
                            <label>Địa chỉ</label>
                            <Select
                                options={provincesOptions}
                                value={provinces}
                                onChange={(value) => handleChangeOptions(value, 1)}
                                placeholder="Tỉnh..."
                                className={cx({ 'err-select-address': listErr.provinces })}
                            />
                        </div>
                        <div className={cx('input-wrapper')} style={{ flexBasis: '33.333%' }}>
                            <Select
                                options={districtsOptions}
                                value={districts}
                                onChange={(value) => handleChangeOptions(value, 2)}
                                placeholder="Huyện.."
                                isDisabled={!provinces}
                                className={cx({ 'err-select-address': listErr.districts })}

                            />
                        </div>
                        <div className={cx('input-wrapper')} style={{ flexBasis: '33.333%' }}>
                            <Select
                                options={communesOptions}
                                value={communes}
                                onChange={(value) => handleChangeOptions(value, 3)}
                                placeholder="Xã..."
                                isDisabled={!districts}
                                className={cx({ 'err-select-address': listErr.communes })}
                            />
                        </div>
                    </div>

                </Tippy>
                <div className={cx('input-wrapper')}>
                    <Input
                        zIndex={1002}
                        value={addressDetail}
                        setValue={setAddressDetail}
                        err={listErr.addressDetail}
                        errContent={null}
                        placeholder="Địa chỉ cụ thể"
                        placementTooltip='right-start' />
                </div>

                <div className={cx('input-wrapper')}>
                    <label>Mật khẩu</label>
                    <Input
                        zIndex={1002}
                        value={password}
                        setValue={setPassword}
                        err={listErr.password}
                        inputType='password'
                        placeholder="Mật khẩu"
                        placementTooltip='right-start' />
                </div>
                <div className={cx('input-wrapper')}>
                    <label>Xác nhận mật khẩu</label>
                    <Input
                        zIndex={1002}
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        err={listErr.confirmPassword.required || listErr.confirmPassword.match}
                        errContent={listErr.confirmPassword.match && !listErr.confirmPassword.required ? 'Mật khẩu xác nhận không khớp' : ''}
                        inputType='password'
                        placeholder="Xác nhận mật khẩu"
                        placementTooltip='right-start' />
                </div>
                <div className={cx('button')}>
                    <ButtonComp onClick={handleRegister}>
                        Đăng ký
                    </ButtonComp>
                </div>

            </div>
            <p>Bạn chưa có tài khoản?
                <button className={cx('link')} onClick={() => changeLayout('login')}>
                    Đăng nhâp</button>
            </p>
            <button className={cx('link')}
                onClick={() => changeLayout('forgetpassword')}>
                Quên mật khẩu
            </button>
            <ModalLoading isLoading={isLoading} />
        </div>
    );
}

Register.propTypes = {
    handleClose: PropTypes.func.isRequired,
    changeLayout: PropTypes.func.isRequired,

};

export default memo(Register);