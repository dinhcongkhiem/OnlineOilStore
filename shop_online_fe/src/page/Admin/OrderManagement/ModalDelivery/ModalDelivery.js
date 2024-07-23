import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Select from 'react-select'


import style from './ModalDelivery.module.scss';
import CheckBox from "../../../../component/CheckBox";
import Input from "../../../../component/Input";
import ButtonComp from "../../../../component/ButtonComp";
import { ModalLoading } from "../../../../layouts/component/Modal";
import AdminService from "../../../../service/AdminService";
import { toast } from "react-toastify";

const cx = classNames.bind(style);
const ModalDelivery = ({ order, isOpen, setOpen, changeStatus }) => {
    const [loading, setLoading] = useState(false);
    const [selectedPayShippingFee, setSelectedPayShippingFee] = useState(0);
    const [selectedPlacePickup, setSelectedPlacePickUp] = useState('cod');
    const [selectedTransportation, setSelectedTransportation] = useState('road');
    const [tagsOrder, setTagsOrder] = useState(
        [
            { value: 1, checked: false },
            { value: 7, checked: false },
            { value: 10, checked: false },
            { value: 11, checked: false },
            { value: 13, checked: false },
            { value: 20, checked: false },
            { value: 22, checked: false },
            { value: 39, checked: false },
        ]
    )
    const [totalWeight, setTotalWeight] = useState('');
    const [CODAmount, setCODAmount] = useState(0);
    const [workShift, setWorkShift] = useState({ value: '', label: 'Mặc định' })
    const listWorkShift = [
        { value: '', label: 'Mặc định' },
        { value: '1', label: 'Buổi sáng' },
        { value: '2', label: 'Buổi chiều' },
        { value: '3', label: 'Buổi tối' }
    ]
    const handleCheckTags = (tagValue) => {
        setTagsOrder(prevTagsOrder =>
            prevTagsOrder.map(tag =>
                tag.value === tagValue ? { ...tag, checked: !tag.checked } : tag
            )
        );
    }

    const handleCreateDelivery = () => {
     
        const data = {
            orderId: order.id,
            isFreeship: selectedPayShippingFee,
            pickMoney: CODAmount,
            pickOption: selectedPlacePickup,
            transport: selectedTransportation,
            pickWorkShift: workShift.value,
            tags: tagsOrder.filter(tag => tag.checked).map(tag => tag.value),
            totalWeight: totalWeight,
        }
        setLoading(true)
        AdminService.createDelivery(data)
        .then(res => {
            if(res.status === 200) {
                changeStatus(1, order.id)
                toast.success("Đã tạo vận đơn thành công",{position: 'top-center'})
            }
        }).catch(err => {
            console.log(err);
            toast.error("Có lỗi xảy ra vui lòng thử lại",{position: 'top-center'})

        }).finally(() => {
            setLoading(false)
            setOpen(false)
        })
    }

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);
    return (
        isOpen &&
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} onClick={() => setOpen(-1)} ></div>
            <div className={cx('popup-delivery')}>
                <h3>Đăng đơn lên GHTK</h3>
                <div className={cx('content')}>
                    <div className={cx('left')}>
                        <div className={cx('order-info')}>
                            <h4>Thông tin đơn hàng</h4>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Giá trị đơn hàng:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.totalPrice.toLocaleString('vi-VN')} VND</p>
                                </div>

                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    Phí ship:
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.deliveryFee.toLocaleString('vi-VN')} VND</p>

                                </div>
                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Ghi chú cho GHTK khi giao:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.note}</p>
                                </div>

                            </div>
                        </div>
                        <div className={cx('order-info')}>
                            <h4>Thông tin người nhận hàng</h4>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>SĐT:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.buyer.phoneNum}</p>
                                </div>

                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    Họ tên:
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.buyer.fullName}</p>
                                </div>
                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    Tỉnh/thành phố:
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.address.provinces.label}</p>

                                </div>
                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Quận/huyện:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.address.districts.label}</p>
                                </div>

                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    Xã/phường:
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.address.communes.label}</p>

                                </div>
                            </div>

                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Địa chỉ:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <p>{order.address.addressDetail}</p>
                                </div>

                            </div>


                        </div>

                    </div>
                    <div className={cx('right')}>
                        <h4>Thông tin đăng đơn lên GHTK</h4>
                        <div>

                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Phí ship:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="fee"
                                            value="Khách trả"
                                            checked={selectedPayShippingFee === 0}
                                            onChange={() => setSelectedPayShippingFee(0)} /> Khách trả
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="fee"
                                            value="Shop trả"
                                            checked={selectedPayShippingFee === 1}
                                            onChange={() => setSelectedPayShippingFee(1)} />Shop trả
                                    </label>
                                </div>

                            </div>

                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Tiền thu hộ:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <Input value={CODAmount} setValue={setCODAmount} errContent=''placeholder={""} />
                                </div>

                            </div>

                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Gửi hàng tại bưu cục?</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="place-pickup"
                                                value="Shipper đến lấy hàng"
                                                checked={selectedPlacePickup === 'cod'}
                                                onChange={() => setSelectedPlacePickUp('cod')}
                                            />
                                            Shipper đến lấy hàng
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="place-pickup"
                                                value="Shop gửi hàng tại bưu cục"
                                                checked={selectedPlacePickup === 'post'}
                                                onChange={() => setSelectedPlacePickUp('post')}
                                            />
                                            Shop gửi hàng tại bưu cục
                                        </label>
                                    </div>

                                </div>

                            </div>

                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Hình thức vận chuyển:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="transportation"
                                            value="Đường bộ"
                                            checked={selectedTransportation === 'road'}
                                            onChange={() => setSelectedTransportation('road')}
                                        /> Đường bộ
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="transportation"
                                            value="Đường bay"
                                            checked={selectedTransportation === 'fly'}
                                            onChange={() => setSelectedTransportation('fly')}
                                        /> Đường bay
                                    </label>
                                </div>

                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Ca lấy hàng:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <div className={cx('row')} style={{ alignItems: 'center' }}>
                                        <div className={cx('col-6')} style={{ border: 'none' }}>
                                            <Select 
                                            options={listWorkShift} 
                                            defaultValue={listWorkShift[0]} 
                                            onChange={(value) => setWorkShift(value)}
                                            />

                                        </div>
                                        <span>Không bắt buộc</span>
                                    </div>
                                </div>

                            </div>
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Nhãn đơn hàng:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 1).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(1)} />
                                        Hàng dễ vỡ (20% phí dịch vụ)
                                    </div>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 7).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(7)}
                                        />
                                        Nông sản/thực phẩm khô (10% phí dịch vụ)
                                    </div>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 10).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(10)}
                                        />
                                        Cho xem hàng
                                    </div>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 11).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(11)}
                                        />
                                        Cho thử hàng/ đồng kiểm
                                    </div>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 13).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(13)}
                                        />
                                        Gọi shop khi khách không nhận hàng, không liên lạc được, sai thông tin
                                    </div>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 20).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(20)}
                                        />
                                        Hàng nguyên hộp (Phí 1.000đ/đơn)
                                    </div>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 22).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(22)}
                                        />
                                        Thư tín, tài liệu
                                    </div>
                                    <div>
                                        <CheckBox
                                            checked={tagsOrder.filter(tag => tag.value === 39).map(tag => tag.checked)[0]}
                                            onClick={() => handleCheckTags(39)}
                                        />
                                        Thực phẩm tươi
                                    </div>
                                </div>

                            </div>
                           
                            <div className={cx('row')}>
                                <div className={cx('col-4')}>
                                    <p>Tổng khổi lượng:</p>
                                </div>
                                <div className={cx('col-6')}>
                                    <div className={cx('row')} style={{ alignItems: 'center' }}>
                                        <div className={cx('col-6')} style={{ border: 'none' }}>
                                            <Input value={totalWeight} setValue={setTotalWeight} errContent='' placeholder={""}/>
                                        </div>
                                        <span>kg</span>
                                    </div>
                                    <p>(Nếu để trống hệ thống sẽ tự động lấy khối lượng của các sản phẩm)</p>
                                </div>

                            </div>



                        </div>
                    </div>
                </div>
                <div className={cx('actions')}>
                    <ButtonComp outline={true} onClick={() => setOpen(-1)}>Hủy</ButtonComp>
                    <ButtonComp onClick={handleCreateDelivery}>Xác nhận</ButtonComp>

                </div>
            </div>
            <ModalLoading isLoading={loading}/>
        </div>

    );
};

export default ModalDelivery;