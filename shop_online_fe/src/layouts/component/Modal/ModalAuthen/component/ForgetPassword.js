import classNames from "classnames/bind"
import PropTypes from 'prop-types';
import { memo, useEffect, useState } from "react";
import style from '../ModalAuthen.module.scss'
import Input from '../../../../../component/Input'
import ButtonComp from '../../../../../component/ButtonComp'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { validateInputsForgetPass } from "../../../../../utills/ValidateInputs";
import AuthenticationService from "../../../../../service/AuthenticationService";
import ModalLoading from "../../ModalLoading/ModalLoading";
import { toast } from "react-toastify";

const cx = classNames.bind(style);

const ForgetPassword = ({ handleClose, changeLayout, showLink }) => {
    const [email, setEmail] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [timeOutButton, setTimeOutButton] = useState();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [listErr, setListErr] = useState({
        email: false,
        emailFormat: false,
        verifyCode: false,
        newPassword: false,
        confirmPassword: {
            required: false,
            match: false
        },
    });

    const handleForgetPassword = () => {
        if (validateInputsForgetPass(listErr, { email, verifyCode, newPassword, confirmPassword }, setListErr)) {
            setIsLoading(true);
            AuthenticationService.setNewPassword({ newPassword, email, verifyCode })
                .then((response) => {
                    toast.success("Thành công.")
                    setIsLoading(false);
                    changeLayout('login')
                })
                .catch(() => {
                    toast.error("Mã xác nhận không đúng hoặc đã hết hạn, vui lòng thử lại.")
                    setIsLoading(false);

                });
        }
    };

    useEffect(() => {
        let timer;
        if (timeOutButton > 0) {
            timer = setTimeout(() => {
                setTimeOutButton(timeOutButton - 1);
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [timeOutButton]);
    const handleSendConfirmCode = () => {
        setTimeOutButton(60);
        setIsLoading(true);
        AuthenticationService.forgetPassword({ email })
            .then(() => {
                toast.success("Đã gửi mã xác nhận về email.")
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Không tìm thấy tài khoản")
                setIsLoading(false);
            });

    }
    return (
        <div className={cx('content')}>
            <FontAwesomeIcon icon={faXmark} className={cx('close-icon')} onClick={handleClose} />
            <Link to='/' className={cx('logo')}>
                <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/logo-dau-nhot-npoil-new-1024x315.png" alt="Logo" />
            </Link>
            <div className={cx('title')}>
                <h2>Thay đổi mật khẩu</h2>
            </div>
            <div className={cx('form')}>
                <div className={cx('input-wrapper')}>
                    <label>Email</label>
                    <Input
                        zIndex={1002}
                        value={email}
                        setValue={setEmail}
                        errContent={listErr.emailFormat ? 'Vui lòng nhập đúng định dạng email' : ''}
                        err={!listErr.email ? listErr.emailFormat : listErr.email}
                        placeholder="Email" placementTooltip='top-end' />

                </div>
                <div className={cx('input-wrapper')}>
                    <label>Mật khẩu mới</label>
                    <Input
                        zIndex={1002}
                        value={newPassword}
                        setValue={setNewPassword}
                        inputType='password'
                        err={listErr.newPassword}
                        placeholder="Mật khẩu mới"
                        placementTooltip='top-end' />

                </div>
                <div className={cx('input-wrapper')} style={{ flex: 1 }}>
                    <label>Xác nhận mật khẩu</label>
                    <Input
                        zIndex={1002}
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        inputType='password'
                        err={listErr.confirmPassword.required || listErr.confirmPassword.match}
                        errContent={listErr.confirmPassword.match && !listErr.confirmPassword.required ? 'Mật khẩu xác nhận không khớp' : ''}
                        placeholder="Xác nhận mật khẩu"
                        placementTooltip='top-end' />

                </div>
                <div className={cx('row-confirm')}>
                    <div className={cx('input-wrapper')} style={{ flex: 1 }}>
                        <label>Mã xác nhận</label>
                        <Input
                            zIndex={1002}
                            value={verifyCode}
                            setValue={setVerifyCode}
                            err={listErr.verifyCode}
                            placeholder="Mã xác nhận"
                            placementTooltip='top-end' />

                    </div>
                    <div className={cx('input-wrapper')}>
                        <ButtonComp onClick={handleSendConfirmCode} outline={true}
                            cssClass={cx('confirm-code', { 'isDisable': timeOutButton > 0 })} disabled={timeOutButton > 0}>
                            {timeOutButton > 0 ? timeOutButton : 'Gửi mã'}
                        </ButtonComp>
                    </div>

                </div>
                <div className={cx('button')}>
                    <ButtonComp onClick={handleForgetPassword} >
                        Thay đổi mật khẩu
                    </ButtonComp>
                </div>

            </div>
            <p style={{ width: '100%', paddingRight: '5rem' }}>
                {showLink && <button style={{ float: 'right' }} className={cx('link')} onClick={() => changeLayout('login')}>
                    Đăng nhập
                </button>}

            </p>
            <ModalLoading isLoading={isLoading} />
        </div>
    );
}
ForgetPassword.propTypes = {
    handleClose: PropTypes.func.isRequired,
    changeLayout: PropTypes.func.isRequired,

};

export default memo(ForgetPassword);