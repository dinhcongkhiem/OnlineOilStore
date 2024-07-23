import classNames from 'classnames/bind';

import style from './ProfileLayout.module.scss'
import DefaultLayout from '../DefaultLayout';
import { Link, useLocation } from 'react-router-dom';
const cx = classNames.bind(style);
function ProfileLayout({ children }) {
    const location = useLocation()

    return (
        <DefaultLayout>
            <div className={cx('wrapper')}>
                <div className={cx('navbar')}>
                    <ul>
                        <li>
                            <Link to='/profile/info' className={cx({ 'active': location.pathname === '/profile/info' })}>Thông tin tài khoản</Link>
                        </li>
                        <li>
                            <Link to='/profile/pass' className={cx({ 'active': location.pathname === '/profile/pass' })}>Đổi mật khẩu</Link>
                        </li>
                    </ul>
                </div>
                {children}
            </div>
        </DefaultLayout>

    );
}

export default ProfileLayout;