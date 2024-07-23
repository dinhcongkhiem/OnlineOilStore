import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { ModalAuthen } from '../component/Modal';
import styles from './DefaultLayout.module.scss';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const [isOpenModalAuthen, setOpenModalAuthen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return (
        <div className={cx('wrapper')}>
            <Header setOpenModal={setOpenModalAuthen}/>
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
            <ModalAuthen setOpen={setOpenModalAuthen} isOpen={isOpenModalAuthen}/>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
