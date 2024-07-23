import classNames from "classnames/bind";

import style from './ModalDetail.module.scss'
const cx = classNames.bind(style);
function ModalDetail({ delivery, isOpen, setOpen }) {
    const formatDate = (dateString) => {
        const [time, dateStr] = dateString.split(' ');
        const [year, month, day] = dateStr.split('-');

        return `${time} ${day}-${month}-${year}`;
    }
    return (
        isOpen &&
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} onClick={() => setOpen(-1)} ></div>
            <div className={cx('content')} >
                <h3>{delivery.deliveryAlias}</h3>
                <div className={cx('delivery-info')}>
                    <div className={cx('general-info')}>
                        <p>
                            Tiền CoD:  <span> {(delivery.total).toLocaleString('vi-VN')} VND</span>
                        </p>
                        <p>
                            Phí dịch vụ cuối dùng:  <span>{delivery.deliveryFee}</span>
                        </p>
                        <p>
                            Ghi chú:  <span>{delivery.note}</span>
                        </p>
                    </div>
                    <div className={cx('estimate')} >
                        <p>Lấy hàng (dự kiến)
                            <span>
                                {formatDate(delivery.estimatedPickTime)}
                            </span>
                        </p>
                        <p>Lấy hàng (dự kiến)
                            <span>
                                {formatDate(delivery.estimatedDeliverTime)}
                            </span>
                        </p>
                    </div>
                    <div className={cx('goods-money')} >
                        <h4>Tiền hàng</h4>
                        <p>Thu hộ
                            <span>
                                {delivery.pickMoney} VND
                            </span>
                        </p>
                        <p>Giá trị hàng hóa
                            <span>
                                {(delivery.orders.totalPrice - delivery.orders.deliveryFee).toLocaleString('vi-VN')} VND
                            </span>
                        </p>
                        <p>Phí bảo hiểm
                            <span>
                                {delivery.insuranceFee.toLocaleString('vi-VN')} VND
                            </span>
                        </p>
                        <p>
                            Phí dịch vụ cuối dùng
                            <span>
                                {delivery.isFreeship === 0 ? "Khách trả - " : "Shop trả - "}
                                {delivery.deliveryFee.toLocaleString('vi-VN')} VND
                            </span>
                        </p>

                        <p>
                            Tổng tiền
                            <span>
                                {(delivery.total).toLocaleString('vi-VN')} VND
                            </span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ModalDetail;