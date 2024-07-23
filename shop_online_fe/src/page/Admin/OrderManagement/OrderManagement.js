import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";

import style from '../Admin.module.scss'
import UniStyle from './OrderManagement.module.scss'
import AdminService from "../../../service/AdminService";
import Pagination from "../../../component/Pagination/Pagination";
import CheckBox from '../../../component/CheckBox'
import { ModalLoading } from '../../../layouts/component/Modal'
import ModalDelivery from "./ModalDelivery/ModalDelivery";

const cx = classNames.bind(style)
const cx1 = classNames.bind(UniStyle)
function OrderManagement() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = Number(new URLSearchParams(location.search).get('page'));
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(-1);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState([
        { status: 0, checked: true },
        { status: 1, checked: true },
        { status: -1, checked: true },
    ])

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(null);

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start === null && end === null) {
            handleGetOrders(currentPage, statusFilter.filter(item => item.checked)
                .map(item => item.status).join(','), null, null);
        }
        if (start !== null && end !== null) {

            handleGetOrders(currentPage, statusFilter.filter(item => item.checked)
                .map(item => item.status).join(','), formatToCallDate(start), formatToCallDate(end));
        }
    };

    const formatToCallDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleChangeStatus = (status, orderId) => {
        if (orders.filter(order => order.id === orderId)[0].status === 1) {
            toast.warning("Không thể hủy đơn hàng này", { position: "top-center" });
            return;
        }
        if (orders.filter(order => order.id === orderId)[0].status === -1) {
            return;
        }
        setLoading(true)
        AdminService.changeStatusOrder(status, orderId)
            .then(res => {
                if (res.status === 200) {
                    const updateItem = orders.map(order =>
                        order.id === orderId ? { ...order, status: status } : order
                    );
                    setOrders(updateItem);
                }
            }).catch(err => console.log(err))
            .finally(() => setLoading(false))
    }
    const handleChangeFilter = (index) => {
        setStatusFilter(prev => {
            let newArr = prev.map((item, i) =>
                i === index ? { ...item, checked: !item.checked } : item
            );
            const checkedCount = newArr.filter(item => item.checked).length;

            if (checkedCount === 0) {
                return prev;
            }
            const data = newArr
                .filter(item => item.checked)
                .map(item => item.status).join(',');
            navigate('/admin/orders?page=1')
            if (startDate && endDate) {
                handleGetOrders(1, data, formatToCallDate(startDate), formatToCallDate(endDate))
            }
            else {
                handleGetOrders(1, data, null, null)

            }
            return newArr;
        });
    }

    const handleOpentModal = async (e, index) => {
        if (orders[index].status === -1) {
            return;
        }
        const isExists = await isDeliveryExists(orders[index].id);
        if (orders[index].status === 1 && isExists) {
            toast.warning("Đã tạo vận đơn cho đơn hàng này.", { position: "top-center" })
            return;
        }
        const newModalOpen = modalOpen === index ? -1 : index
        setModalOpen(newModalOpen)
    }
    const isDeliveryExists = async (orderId) => {
        setLoading(true);
        try {
            const res = await AdminService.getDeliveryExists(orderId);
            return res.data;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            setLoading(false);
        }
    }
    const handleGetOrders = (page, statusFilter, startDate, endDate) => {
        setLoading(true)
        AdminService.getOrders(page, statusFilter, startDate, endDate)
            .then(res => {
                const orders = res.data._embedded ? res.data._embedded.orderResponseList : null
                setOrders(orders)
                setPage(res.data.page)
                window.scroll(0, 0)
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setLoading(false)
            })
    }
    const formatAddress = ({ provinces, districts, communes, addressDetail }) => {
        return `${provinces.label}, ${districts.label}, ${communes.label}, ${addressDetail}`;
    };
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const offset = 7 * 60;
        const localDate = new Date(date.getTime() + offset * 60 * 1000);
        const day = String(localDate.getUTCDate()).padStart(2, '0');
        const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
        const year = localDate.getUTCFullYear();

        return `${day}-${month}-${year}`;
    }
    useEffect(() => {
        handleGetOrders(currentPage, statusFilter.filter(item => item.checked)
            .map(item => item.status).join(','));
    }, [currentPage]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('options')}>
                <div style={{ flex: '1' }}>
                    <div className={cx('option')}>
                        <p className={cx('title')} style={{ display: 'inline-block', }}>Trạng thái: </p>
                        <div className={cx('checkbox-status')}>
                            <div><CheckBox checked={statusFilter[0].checked} onClick={() => handleChangeFilter(0)} cssClass={cx('checkbox')} />Chờ xử lý</div>
                            <div><CheckBox checked={statusFilter[1].checked} onClick={() => handleChangeFilter(1)} cssClass={cx('checkbox')} />Đã nhận</div>
                            <div><CheckBox checked={statusFilter[2].checked} onClick={() => handleChangeFilter(2)} cssClass={cx('checkbox')} />Đã hủy</div>
                        </div>
                    </div>
                    <div className={cx('option')}>
                        <p className={cx('title')}>
                            Ngày đặt hàng:
                        </p>
                        <DatePicker
                            selected={startDate}
                            onChange={onChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            isClearable={true}
                        />
                    </div>
                </div>

                <div className={cx('orderby')}>
                    <br />
                    <p>Hiển thị  {orders?.length || 0} của {page.totalElements} kết quả</p>

                </div>
            </div>
            <table className={cx1('order-management')}>

                <thead>
                    <tr>
                        <th>#</th>
                        <th>Thông tin khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Tổng <span style={{ opacity: .5 }}>(VND)</span> </th>
                        <th>Ngày đặt hàng</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders ?
                        orders.map((order, index) => {
                            return (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>
                                        <span className={cx('nameCustomer')}>{order.buyer.fullName}</span> <br />
                                        {order.buyer.phoneNum} <br />
                                        {order.buyer.email} <br />
                                        {formatAddress(order.address)}
                                    </td>
                                    <td>
                                        <ul>
                                            {order?.orderDetails.map((orderDetail) => {
                                                return (
                                                    <li key={orderDetail.id}>
                                                        {orderDetail.productDetail.nameProduct}
                                                        <span style={{ marginLeft: '1rem', opacity: .8 }}>
                                                            {`(${orderDetail.productDetail.color.nameColor ? `${orderDetail.productDetail.color.nameColor}, ` : ''}${orderDetail.productDetail.weight} KG)`}

                                                        </span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </td>
                                    <td>{order.totalPrice.toLocaleString('vi-VN')}</td>
                                    <td>{formatDate(order.createDate)}</td>
                                    <td>{order.note}</td>
                                    <td className={cx('status')}>
                                        <span
                                            className={cx({
                                                'canceled': order.status === -1,
                                                'pending': order.status === 0,
                                                'order-received': order.status === 1
                                            })}>
                                            {order.status === -1 ? 'Đã hủy' : (order.status === 0 ? 'Chờ xử lý' : 'Đã nhận đơn')}
                                        </span>
                                    </td>
                                    <td className={cx('action')}>
                                        <div>
                                            <ModalDelivery order={order} isOpen={modalOpen === index} setOpen={setModalOpen} changeStatus={handleChangeStatus} />
                                            <span className={cx('action-btn')}
                                                onClick={(e) => handleOpentModal(e, index)}>
                                                Tạo vận đơn
                                            </span>
                                        </div>
                                        <span className={cx('action-btn')} onClick={() => handleChangeStatus(-1, order.id)}>Hủy</span>
                                    </td>
                                </tr>
                            )
                        })
                        : (
                            <tr>
                                <td colSpan={8}>
                                    <h3>Không có đơn hàng nào phù hợp</h3>
                                </td>
                            </tr>

                        )
                    }

                </tbody>

            </table>
            <Pagination maxPage={page.totalPages} uri={"/admin/orders"} />
            <ModalLoading isLoading={loading} />
        </div >
    );
}

export default OrderManagement;
