import classNames from "classnames/bind"
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useState } from "react";
import style from './ModalAuthen.module.scss'
import Login from "./component/Login";
import Register from "./component/Register";
import ForgetPassword from "./component/ForgetPassword";
const cx = classNames.bind(style);

function ModalAuthen({ setOpen, isOpen, startLayout }) {
    const [isClosing, setIsClosing] = useState(false);
    const [layout, setLayout] = useState('login')
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setOpen(false);
            setIsClosing(false);
            startLayout ? setLayout(startLayout) : setLayout('login')
        }, 300);
    },[]);
    const handleChangeLayout = useCallback((layout) => {
        setTimeout(() => {
            setLayout(layout);
        }, 300);
    },[]);
    useEffect(() => {
        if (startLayout) {
            setLayout(startLayout)
        }
    }, [])
    return (
        isOpen &&
        <div className={cx('wrapper', { 'isClosing': isClosing })}>
            <div className={cx('overlay')} onClick={handleClose}></div>
            {(layout === 'login') && <Login handleClose={handleClose} changeLayout={handleChangeLayout} />}
            {(layout === 'register') && <Register handleClose={handleClose} changeLayout={handleChangeLayout} />}
            {(layout === 'forgetpassword') && <ForgetPassword handleClose={handleClose} changeLayout={handleChangeLayout} showLink={!startLayout} />}


        </div>

    );
}

ModalAuthen.propTypes = {
    setOpen: PropTypes.func,
    isOpen: PropTypes.bool,
    startLayout: PropTypes.string
}
export default memo(ModalAuthen);