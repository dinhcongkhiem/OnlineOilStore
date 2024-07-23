import classNames from 'classnames/bind';

import style from './AdminLayout.module.scss'
import DefaultLayout from '../DefaultLayout';
import { Link, useLocation } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
const cx = classNames.bind(style);
function AdminLayout({ children }) {
    const location = useLocation()

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>

                <div className={cx('content')}>
                    <div className={cx('navbar')}>
                        <ul>
                            <li>
                                <Link to='/admin/orders' className={cx({ 'active': location.pathname === '/admin/orders' })}>Đơn hàng</Link>
                            </li>
                            <li>
                                <Link to='/admin/delivery' className={cx({ 'active': location.pathname === '/admin/delivery' })}>Quá trình vận đơn</Link>
                            </li>
                        </ul>
                    </div>
                    {children}
                </div>
            </div>
            <Footer />
        </div>

    );
}

export default AdminLayout;