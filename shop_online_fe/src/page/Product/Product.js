import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import style from './Product.module.scss'
import FilterProduct from "../../component/FilterProduct/FilterProduct";
import SectionProduct from '../../component/SectionProduct'
import Pagination from "../../component/Pagination/Pagination";
import Select from "react-select";
import ProductService from "../../service/ProductService";
import { useLocation } from "react-router-dom";
import { ModalLoading } from "../../layouts/component/Modal";
const cx = classNames.bind(style)

function Product() {
    const [products, setProducts] = useState();
    const [showFilterSideBar, setShowFilterSideBar] = useState(false);
    const [orderBy, setOrderBy] = useState({ value: "0", label: 'Thứ tự mặc định' });
    const [isLoading, setIsLoading] = useState(false)
    const [isMobileDevice,setIsMobileDevice] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const data = useMemo(() => ({
        minPrice: queryParams.get('minPrice'),
        maxPrice: queryParams.get('maxPrice'),
        keyword: queryParams.get('keyword'),
        categoryId: queryParams.get('categoryId'),
        attributes: queryParams.get('attributes'),
        page: queryParams.get('page')
    }), [location.search]);


    const currentPage = queryParams.get('page');
    const optionsOrderby = [
        { value: "0", label: 'Thứ tự mặc định' },
        { value: "1", label: 'Mới nhất' },
        { value: "2", label: 'Thứ tự theo giá: thấp đến cao' },
        { value: "3", label: 'Thứ tự theo giá: cao xuống thấp' }
    ]

    const handleChangeSort = (value) => {
        console.log(value);
        if(queryParams.size >= 1 && queryParams.get('keyword') !== null) {
            handleSearchProduct(value)
        }else if(queryParams.size >= 1 && queryParams.get('categoryId') !== null) {
            handleSearchProduct(value)
        }else {
            fetchProduct(currentPage,value);
        }
        setOrderBy(value);
    }

    const fetchProduct = (currentPage, orderBy) => {
        setIsLoading(true)
        let page = 0
        if (currentPage) {
            page = currentPage - 1;
        }
        ProductService.getProduct(page, orderBy?.value || 0)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data._embedded.productList);
                    setProducts({
                        page: res.data.page,
                        content: res.data._embedded.productResponseList
                    })
                }
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoading(false);
            })
    }

    useEffect(() => {
        if (queryParams.size <= 1 && queryParams.get('keyword') === null && queryParams.get('categoryId') === null) {
            fetchProduct(currentPage, orderBy);
        }
    }, [location.search])

    const handleSearchProduct = useCallback((orderBy) => {
        if(queryParams.size >= 1){
            if (queryParams.get('categoryId') === null) {    
                ProductService.searchProduct(data, orderBy?.value || 0)
                    .then(res => {
                        if (res.status === 200) {
                            setProducts({
                                page: res.data.page,
                                content: res.data._embedded?.productResponseList
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    }).finally(() => {
                        setIsLoading(false);
                    })
            }else {
                ProductService.searchProductByCategory(data, orderBy?.value || 0)
                    .then(res => {
                        if (res.status === 200) {
                            setProducts({
                                page: res.data.page,
                                content: res.data._embedded?.productResponseList
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    }).finally(() => {
                        setIsLoading(false);
                    })
            }
        }
       

    }, [data])

    useEffect(() => {
        handleSearchProduct(orderBy);
    }, [handleSearchProduct])

    useEffect(() => {
        if (window.matchMedia('(max-width: 740px)').matches) {
            setIsMobileDevice(true);
        } else {
            setIsMobileDevice(false);
        }

    }, [])
    return (
        <div className={cx('wrapper')}>
            {isMobileDevice &&
                <FilterProduct isShow={showFilterSideBar} setShow={setShowFilterSideBar} />
                }
            <div className={cx('page-title')}>
                <div className={cx('title')}>
                    <h1>Cửa hàng</h1>
                </div>
                <h3 className={cx({ 'isShow': showFilterSideBar })} onClick={() => setShowFilterSideBar(true)}>
                    <FontAwesomeIcon icon={faFilter} className={cx('icon-filter')} />
                    Lọc
                </h3>

                <div className={cx('order')}>

                    <p>Hiển thị  {products?.content?.length || 0} của {products?.page.totalElements} kết quả</p>
                    <Select
                        options={optionsOrderby}
                        value={orderBy}
                        onChange={handleChangeSort}
                        isSearchable={false}
                        placeholder="Sắp xếp..."
                        className={cx('orderby-select')}
                    />

                </div>
            </div>

            <SectionProduct category={null} products={products?.content} />
            <Pagination maxPage={products?.page.totalPages}  uri={"/product"}/>
            <ModalLoading isLoading={isLoading} />
        </div>
    );
}

export default Product;