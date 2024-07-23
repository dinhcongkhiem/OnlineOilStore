import { useContext, useEffect, useRef, useState } from 'react';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import Tippy from '@tippyjs/react/headless';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Header.module.scss'
import { AuthenticationContext } from '../../../context/AuthenticationProvider';
import NavItems from '../../../component/NavItems';
import CategoryService from '../../../service/CategoryService';
const cx = classNames.bind(styles);

function Header({ setOpenModal }) {
    const [isFixed, setIsFixed] = useState(false);
    const [activeSubNav, setActiveSubNav] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchKey, setSearchKey] = useState('');
   
    const navbarRef = useRef(null);
    const subNavRef = useRef(null);
    const menuBtnRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    const { logout, authentication } = useContext(AuthenticationContext);

    const handleCloseSubNav = (e) => {
        if (document.elementFromPoint(e.clientX, e.clientY) !== subNavRef.current) {
            setActiveSubNav(false)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchKey === '') {
            return;
        }

        navigate(`/product?keyword=${searchKey}`)
        setSearchKey('');
    }
    const fetchCategories = () => {
        CategoryService.getCategories()
            .then((response) => {
                if (response.status === 200) {
                    setCategories(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }
    const handleClickCategory = (cateId) => {
        navigate(`/product?categoryId=${cateId}`)
    }

    useEffect(() => {
        fetchCategories();
        const handleScroll = () => {
            if (navbarRef.current) {
                const scrollY = window.scrollY;
                if (!window.matchMedia('(max-width: 740px)').matches && scrollY > navbarRef.current.offsetHeight + 80) {
                    setIsFixed(true);

                } else {
                    setIsFixed(false);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        logout()
    }

    return (
        <header className={cx('wrapper')}>
            <div className={cx('masthead')}>
                <div className={cx('inner-masthead')}>
                    <div className={cx('menu-btn')} >
                        <FontAwesomeIcon ref={menuBtnRef} icon={faBars} onClick={() => setActiveSubNav(true)} />
                    </div>
                    <div className={cx('logo')}>
                        <Link to="/">
                            <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2023/10/logo-dau-nhot-npoil-new-1024x315.png" alt="Logo" />
                        </Link>
                    </div>
                    <div className={cx('left-element')}>
                        <form onSubmit={handleSubmit}>
                            <div className={cx('input-search')}>
                                <input type="text" placeholder='Tìm kiếm sản phẩm'
                                    value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
                            </div>
                            <div className={cx('search-btn')}>
                                <button type='submit' >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </button>
                            </div>
                        </form>
                        <div className={cx('support')}>
                            <div>
                                <img src="https://shop.daunhotnpoil.com/wp-content/uploads/2019/02/icon_03.png" alt="Support icon" />
                            </div>
                            <div className={cx('support-content')}>
                                <p>
                                    <span>Hỗ trợ khách hàng</span>
                                    <br />
                                    <span style={{ color: 'red', fontSize: '1.6rem' }}>1900 75 75 25</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('right-element')}>
                        {authentication.isAuthen ?
                            (authentication.user.role === 'USER' ?
                                <Tippy
                                    interactive
                                    placement="bottom-end"
                                    render={(attrs) => (
                                        <>
                                            <ul className={cx('user-menu')} {...attrs}>
                                                <li><Link to='/profile/info'>Thông tin cá nhân</Link></li>
                                                <li><Link to='/cart'>Giỏ hàng</Link></li>
                                                <li><Link to='/' onClick={handleLogout}>Đăng xuất</Link></li>

                                            </ul>
                                        </>
                                    )}>
                                    <button>
                                        <FontAwesomeIcon icon={faUser} />
                                    </button>
                                </Tippy> :
                                <Tippy
                                    interactive
                                    placement="bottom-end"
                                    render={(attrs) => (
                                        <>
                                            <ul className={cx('user-menu')} {...attrs}>
                                                <li><Link to='/admin/orders'>Quản lý đơn hàng</Link></li>
                                                <li><Link to='/admin/delivery'>Trạng thái đơn hàng</Link></li>
                                                <li><Link to='/' onClick={handleLogout}>Đăng xuất</Link></li>

                                            </ul>
                                        </>
                                    )}>
                                    <button>
                                        <FontAwesomeIcon icon={faUser} />
                                    </button>
                                </Tippy>
                            )
                            : <button
                                onClick={() => setOpenModal(true)}>
                                <FontAwesomeIcon icon={faUser} />
                            </button>}
                    </div>
                </div>
            </div>
            <div ref={navbarRef}
                className={cx('navbar',
                    { 'fixed': isFixed, 'active-navbar': activeSubNav })}
                onClick={handleCloseSubNav}>
                <div className={cx('inner-navbar')}>

                    <div className={cx('category-nav')}>
                        {location.pathname === '/' && !isFixed ?
                            <>
                                <div className={cx('category-title')} >
                                    <FontAwesomeIcon icon={faBars} style={{ marginRight: '0.9rem' }} />
                                    Danh mục sản phẩm

                                </div>
                                <ul className={cx('category-menu', 'show')}>
                                    {categories.map((item, index) => {
                                        return <NavItems items={item} key={index} onClick={() => handleClickCategory(item.id)}/>
                                    })}
                                </ul>
                            </>

                            :
                            <Tippy
                                interactive
                                placement="bottom-end"
                                render={(attrs) => (
                                    <>
                                        <ul className={cx('category-menu')} {...attrs}>
                                            {categories.map((item, index) => {
                                                return <NavItems items={item} key={index} onClick={() => handleClickCategory(item.id)}/>
                                            })}
                                        </ul>
                                    </>
                                )}>
                                <div className={cx('category-title')} >
                                    <FontAwesomeIcon icon={faBars} style={{ marginRight: '0.9rem' }} />
                                    Danh mục sản phẩm
                                </div>
                            </Tippy>
                        }




                    </div>
                    <div ref={subNavRef} className={cx('sub-nav', { 'active-sub-nav': activeSubNav, 'unactive-sub-nav': !activeSubNav })}>
                        <ul>
                            <li><Link to="/introduce">GIỚI THIỆU</Link></li>
                            <li><Link to='/product'>SẢN PHẨM</Link></li>
                            <li><Link to='/contact'>LIÊN HỆ</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;