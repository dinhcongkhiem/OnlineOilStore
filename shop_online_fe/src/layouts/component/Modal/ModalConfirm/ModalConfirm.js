import classNames from "classnames/bind"
import PropTypes from 'prop-types';
import style from './ConfirmModal.module.scss'
import ButtonComp from "../../../../component/ButtonComp";
import { memo } from "react";

const cx = classNames.bind(style);

function ModalConfirm({ isOpen, message, onConfirm, onClose, confirmParam }) {
    return (
        isOpen &&
        <div className={cx('wrapper')}>
            <div className={cx('overlay')} onClick={onClose}></div>
            <div className={cx('content')}>
                <h3>Xác nhận</h3>
                <p>{message}</p>
                <div className={cx('wrapper-btn')}>
                    <ButtonComp outline={true} style={{ marginRight: '2rem' }} onClick={onClose}>Hủy</ButtonComp >
                    <ButtonComp onClick={() => onConfirm(confirmParam)}>Xác nhận</ButtonComp>

                </div>
            </div>
        </div>
    );
}
ModalConfirm.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,

};

export default memo(ModalConfirm);