import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);

const Pagination = ({ maxPage ,uri}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPage = Number(new URLSearchParams(location.search).get('page')) || 1;
    const pages = Array.from({ length: maxPage }, (_, i) => i + 1)
    const range = 5;
    const startPage = Math.max(1, currentPage - Math.floor(range / 2));
    const endPage = Math.min(maxPage, currentPage + Math.floor(range / 2));

    const visiblePages = pages.slice(startPage - 1, endPage);

    const handleChangePage = (page) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', page)
        navigate(`${uri}?${searchParams}`)
    }
    return (
        <div className={cx('pagination')}>
            <a onClick={() => handleChangePage(currentPage - 1 <= 0 ? '1' : currentPage - 1)}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </a>

            {visiblePages.map((page, index) => (
                <a
                    onClick={() => handleChangePage(page)}
                    className={cx({ 'current-page': currentPage === page })}
                    key={index}
                >
                    {page}
                </a>
            ))}
            <a onClick={() => handleChangePage(currentPage + 1 <= maxPage ? currentPage + 1 : maxPage)}>
                <FontAwesomeIcon icon={faChevronRight} />
            </a>


        </div>
    );
};

Pagination.propTypes = {
    maxPage: PropTypes.number
};

export default Pagination;
