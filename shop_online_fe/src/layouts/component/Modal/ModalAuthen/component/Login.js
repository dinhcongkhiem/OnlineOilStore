import classNames from "classnames/bind"
import PropTypes from 'prop-types';
import { memo, useCallback, useContext, useState } from "react";
import style from '../ModalAuthen.module.scss'
import Input from '../../../../../component/Input'
import ButtonComp from '../../../../../component/ButtonComp'
import CheckBox from '../../../../../component/CheckBox'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { validateInputsLogin } from "../../../../../utills/ValidateInputs";
import {AuthenticationContext} from '../../../../../context/AuthenticationProvider';
import ModalLoading from "../../ModalLoading/ModalLoading";
const cx = classNames.bind(style);

const Login = ({ handleClose, changeLayout }) => {
    const { login } = useContext(AuthenticationContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberUser, setRememberUser] = useState(false);
    const [listErr, setListErr] = useState({
        email: false,
        emailFormat: false,
        password: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (() => {
        if (validateInputsLogin(listErr, { email, password }, setListErr)) {
            setIsLoading(true);
            login(email, password,rememberUser, setIsLoading, handleClose);
        }
    });

    return (
        <div className={cx('content')}>
            <FontAwesomeIcon icon={faXmark} className={cx('close-icon')} onClick={handleClose} />
            <Link to='/' className={cx('logo')}>
                <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/logo-dau-nhot-npoil-new-1024x315.png" alt="Logo" />
            </Link>
            <div className={cx('title')}>
                <h2>Đăng nhập</h2>
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
                        placeholder="Email"
                        placementTooltip='top-end' />

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
                        placementTooltip='top-end' />
                </div>
                <div className={cx('checkbox')} onClick={() => setRememberUser(!rememberUser)}>
                    <CheckBox checked={rememberUser} />
                    <p>Ghi nhớ đăng nhập</p>
                </div>
                <div className={cx('button')}>
                    <ButtonComp onClick={handleLogin}>
                        Đăng nhập
                    </ButtonComp>
                </div>

            </div>
            <p>Bạn chưa có tài khoản?
                <button className={cx('link')} onClick={() => changeLayout('register')}>Đăng ký</button>
            </p>
            <button className={cx('link')}
                onClick={() => changeLayout('forgetpassword')}>
                Quên mật khẩu
            </button>
            <ModalLoading  isLoading={isLoading}/>
        </div>
    );
}
Login.propTypes = {
    handleClose: PropTypes.func.isRequired,
    changeLayout: PropTypes.func.isRequired,

};

export default memo(Login);