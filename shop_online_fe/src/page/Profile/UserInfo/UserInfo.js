import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import Select from 'react-select'

import Input from '../../../component/Input'
import ButtonComp from '../../../component/ButtonComp'

import style from '../Profile.module.scss'
import DataAddress from '../../../service/Address'
import { useState, useEffect, useCallback } from 'react';
import { validateInputChangeInfo } from '../../../utills/ValidateInputs';
import UserSevice from '../../../service/UserSevice';
import { ModalLoading } from '../../../layouts/component/Modal';
import { toast } from 'react-toastify';
const cx = classNames.bind(style);
function UserInfor() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [provinces, setProvinces] = useState();
    const [districts, setDistricts] = useState();
    const [communes, setCommunes] = useState();
    const [addressDetail, setAddressDetail] = useState('');

    const [provincesOptions, setProvincesOptions] = useState();
    const [districtsOptions, setDistrictsOptions] = useState();
    const [communesOptions, setCommunesOptions] = useState();

    const [listErr, setListErr] = useState({
        fullname: false,
        email: false,
        emailFormat: false,
        password: false,
        provinces: false,
        districts: false,
        communes: false,
        addressDetail: false
    });
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fetchUserInfo = useCallback(() => {
        const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
        if (user) {
            console.log(user);
            setFullname(user.fullName);
            setEmail(user.email);
            setPhoneNum(user.phoneNum);
            setProvinces(user.address.provinces)
            setDistricts(user.address.districts)
            setCommunes(user.address.communes)
            setAddressDetail(user.address.addressDetail)

            loadDataOptions(1, 0);
            loadDataOptions(2, user.address.provinces.value);
            loadDataOptions(3, user.address.districts.value);
        }
    },[])


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

    const handleChangeInfo = () => {
        if (validateInputChangeInfo(
            listErr,
            {
                email, fullname, phoneNum,
                provinces, districts, communes,
                addressDetail
            }, setListErr)) {
            setIsLoading(true);
            const user = {
                fullName: fullname, email, phoneNum,
                address: {
                    provinces, districts, communes, addressDetail
                }
            }
            UserSevice.changeUserInfo(user)
                .then((response) => {
                    toast.success("Thành công.")
                    setIsLoading(false);

                    const userString = JSON.stringify(response.data);
                    localStorage.getItem('user') ?
                        localStorage.setItem('user', userString) :
                        sessionStorage.setItem('user', userString)
                }).catch(error => {
                    toast.success("Có lỗi xảy ra vui lòng thử lại")
                    setIsLoading(false);

                    throw error;
                });


        }
    }
    useEffect(() => {
        loadDataOptions(1, 0);
        if (window.matchMedia('(max-width: 740px)').matches) {
            setIsMobileDevice(true);
        } else {
            setIsMobileDevice(false);
        }
        fetchUserInfo();
    },[fetchUserInfo])

    return (
        <div className={cx('wrapper-user-info')}>
            <h3 className={cx('title')}>Thông tin cá nhân</h3>
            <div className={cx('content')}>
                <div className={cx('row', 'd-flex')}>

                    <label>Email</label>
                    <Input value={email} setValue={setEmail} errContent={listErr.emailFormat ? 'Vui lòng nhập đúng định dạng email' : ''}
                        err={!listErr.email ? listErr.emailFormat : listErr.email}
                         placeholder="Email" placementTooltip='top-end' readOnly={true}/>
                </div>
                <div className={cx('row', 'd-flex')}>
                    <div className={cx('col-2', 'd-flex')}>
                        <label>Họ và tên</label>
                        <Input value={fullname} setValue={setFullname}
                            err={listErr.fullname} placeholder="Họ và tên" placementTooltip='top-end' />
                    </div>
                    <div className={cx('col-2', 'd-flex')} style={{ marginLeft: '2rem' }}>
                        <label>Số điện thoại</label>
                        <Input value={phoneNum} setValue={setPhoneNum}
                            err={listErr.phoneNum} placeholder="Số điện thoại" placementTooltip='top-end' />

                    </div>
                </div>

                <Tippy content={`Vui lòng nhập đầy đủ địa chỉ`}
                    className={cx('tooltip-address')} arrow={false}
                    visible={(listErr.provinces || listErr.districts || listErr.communes || listErr.addressDetail) && !isMobileDevice}
                    placement="top-end">
                    <div>
                        <div className={cx('col', 'd-flex')}>
                            <label>Địa chỉ</label>
                            <div className={cx('col', 'd-flex')} style={{ marginBottom: '0.6rem' }}>
                                <div style={{ flexBasis: '33.333%' }} className={cx('width100-md')} >
                                    <Select
                                        options={provincesOptions}
                                        value={provinces}
                                        onChange={(value) => handleChangeOptions(value, 1)}
                                        placeholder="Tỉnh..."
                                        className={cx({ 'err-select-address': listErr.provinces })}
                                    />
                                </div>
                                <div style={{ flexBasis: '33.333%' }} className={cx('width100-md')}>
                                    <Select
                                        options={districtsOptions}
                                        value={districts}
                                        onChange={(value) => handleChangeOptions(value, 2)}
                                        placeholder="Huyện.."
                                        isDisabled={!provinces}
                                        className={cx({ 'err-select-address': listErr.districts })}

                                    />
                                </div>
                                <div style={{ flexBasis: '33.333%' }} className={cx('width100-md')}>
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
                        </div>
                        <div className={cx('row', 'd-flex')}>
                            <label></label>
                            <Input value={addressDetail} setValue={setAddressDetail} errContent={null}
                                err={listErr.addressDetail} placeholder="Địa chỉ cụ thể" placementTooltip='top-end' />
                        </div>
                    </div>
                </Tippy>
                <ButtonComp outline={true} onClick={handleChangeInfo}>Lưu thay đổi</ButtonComp>


            </div>
            <ModalLoading isLoading={isLoading} />
        </div>
    );
}

export default UserInfor;