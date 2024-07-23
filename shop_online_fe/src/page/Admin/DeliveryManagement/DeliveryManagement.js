import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select'
import DatePicker from "react-datepicker";

import Pagination from "../../../component/Pagination/Pagination";
import { ModalLoading } from '../../../layouts/component/Modal'
import ButtonComp from "../../../component/ButtonComp";
import style from '../Admin.module.scss'
import UniStyle from './DeliveryManagement.module.scss'
import AdminService from "../../../service/AdminService";
import { statusData } from "./statusData";
import ModalDetail from "./ModalDetail/ModalDetail";
import { ADMIN_URL } from "../../../service/config";
const cx = classNames.bind(style)
const cx2 = classNames.bind(UniStyle)

function DeliveryManagement() {
    const location = useLocation();
    const currentPage = Number(new URLSearchParams(location.search).get('page'));
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(-1);
    const [deliveries, setDeliveries] = useState([]);
    const [page, setPage] = useState(0);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(null);
    const [statusValueFilter, setStatusValueFilter] = useState();

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start === null && end === null) {
            handleDeliveries(currentPage, statusValueFilter?.value)
        }
        if (start !== null && end !== null) {

            handleDeliveries(currentPage, statusValueFilter?.value, formatToCallDate(start), formatToCallDate(end))
        }
    };
    const formatToCallDate = (date) => {
        const day = String(date?.getDate()).padStart(2, '0');
        const month = String(date?.getMonth() + 1).padStart(2, '0');
        const year = date?.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleChangeFilter = (value) => {
        setStatusValueFilter(value)
        if (startDate && endDate) {
            handleDeliveries(currentPage, value.value, formatToCallDate(startDate), formatToCallDate(endDate))

        } else {
            handleDeliveries(currentPage, value.value, null, null)

        }
    }

    const handleUpdateStatus = () => {
        const listAlias = deliveries.map(d => d.deliveryAlias)
        setLoading(true)
        if (startDate && endDate) {
            AdminService.updateDeliveriesStatus(listAlias, currentPage, statusValueFilter?.value,
                formatToCallDate(startDate), formatToCallDate(endDate))
                .then(res => {
                    const deliveries = res.data._embedded ? res.data._embedded.deliveryResponseList : null
                    setDeliveries(deliveries)
                    setPage(res.data.page)
                    window.scroll(0, 0)
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    setLoading(false)
                })
            return
        } else {
            AdminService.updateDeliveriesStatus(listAlias, currentPage, statusValueFilter?.value,
                null, null)
                .then(res => {
                    const deliveries = res.data._embedded ? res.data._embedded.deliveryResponseList : null
                    setDeliveries(deliveries)
                    setPage(res.data.page)
                    window.scroll(0, 0)
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    setLoading(false)
                })
            return
        }

    }
    const handleCancel = (deliveryAlias, currentStatus) => {
        if(currentStatus === -1){
            return 
        }
        setLoading(true)
        AdminService.cancelDelivery(deliveryAlias)
            .then(res => {
                if(res.status === 200) {
                    const updatedDeliveries = deliveries.map(delivery => {
                        if (delivery.deliveryAlias === deliveryAlias) {
                            return { ...delivery, status: -1 };
                        }
                        return delivery;
                    });
            
                    setDeliveries(updatedDeliveries);
                }
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setLoading(false)
            })
    }
   
    const handleDeliveries = (page, statusFilter, startDate, endDate) => {
        setLoading(true)
        AdminService.getDeliveries(page, statusFilter, startDate, endDate)
            .then(res => {
                const deliveries = res.data._embedded ? res.data._embedded.deliveryResponseList : null
                setDeliveries(deliveries)
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

    useEffect(() => {
        handleDeliveries(currentPage, null)
    }, [currentPage]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('options')}>
                <div style={{ flex: '1' }}>
                    <div className={cx('option')}>
                        <p className={cx('title')} style={{ display: 'inline-block', }}>Trạng thái: </p>
                        <Select
                            options={statusData}
                            value={statusValueFilter}
                            onChange={handleChangeFilter}
                            isSearchable={false}
                            placeholder="Sắp xếp..."
                            className={cx('orderby-select')}
                        />
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

                <div className={cx2('update-status')}>
                    <ButtonComp outline={true} onClick={handleUpdateStatus}>Cập nhật trạng thái</ButtonComp>
                    <p>Hiển thị  {deliveries?.length || 0} của {page.totalElements} kết quả</p>

                </div>
            </div>
            <table className={cx2('delivery')}>

                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mã đơn hàng</th>
                        <th>Thông tin khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveries ?

                        deliveries.map((delivery, index) => {
                            return (
                                <tr key={delivery.id}>
                                    <td>{index + 1}</td>
                                    <td>{delivery.deliveryAlias}</td>
                                    <td>
                                        <span className={cx('nameCustomer')}>{delivery?.orders?.buyer.fullName}</span> <br />
                                        {delivery?.orders?.buyer.phoneNum} <br />
                                        {delivery?.orders?.buyer.email} <br />
                                        {formatAddress(delivery?.orders?.address)}
                                    </td>
                                    <td>
                                        <ul>
                                            {delivery?.orders?.orderDetails.map((orderDetail) => {
                                                return (
                                                    <li key={orderDetail.id}>
                                                        {orderDetail.productDetail.nameProduct}
                                                        <span style={{ marginLeft: '1rem', opacity: .8 }}>
                                                            {`(${orderDetail.productDetail.color.nameColor
                                                                ? `${orderDetail.productDetail.color.nameColor}, `
                                                                : ''}
                                                            ${orderDetail.productDetail.weight} KG)`}

                                                        </span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </td>
                                    <td className={cx('status')}>
                                        <span
                                            className={cx('order-received', { 'canceled': delivery.status === -1 })}>
                                            {statusData.find(item => item.value == delivery.status)?.label}
                                        </span>
                                    </td>
                                    <td className={cx('action')}>
                                        <ModalDetail isOpen={index === modalOpen} setOpen={setModalOpen} delivery={delivery}/>
                                        <div>
                                            <span className={cx('action-btn')}
                                                onClick={() => setModalOpen(index)}>
                                                Chi tiết
                                            </span>
                                        </div>
                                        <a className={cx('action-btn')} href={`${ADMIN_URL}/delivery-label?deliveryAlias=${delivery.deliveryAlias}`}  target="_blank">
                                            In đơn hàng
                                        </a>
                                        <span className={cx('action-btn')}
                                            onClick={() => handleCancel(delivery.deliveryAlias, delivery.status)}>
                                            Hủy
                                        </span>
                                    </td>
                                </tr>
                            )
                        })
                        :
                        (
                            <tr>
                                <td colSpan={6}>
                                    <h3>Không có đơn hàng nào phù hợp</h3>
                                </td>
                            </tr>
                        )
                    }
                </tbody>

            </table>
            <Pagination maxPage={page.totalPages} uri={"/admin/delivery"} />
            <ModalLoading isLoading={loading} />
        </div>
    );
}

export default DeliveryManagement;
