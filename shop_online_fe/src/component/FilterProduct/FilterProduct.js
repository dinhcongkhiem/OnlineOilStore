import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider'
import classNames from 'classnames/bind';

import style from './FilterProduct.module.scss'
import CheckBox from '../CheckBox';
import ProductService from '../../service/ProductService';
import useDebounce from '../../hooks/useDebounce'
import { useLocation, useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
function FilterProduct({ isShow, setShow }) {
    const [valueRange, setValueRange] = useState([])
    const [priceRange, setPriceRange] = useState([]);
    const [listWeight, setListWeight] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keywordSearch = searchParams.get('keyword');
    const categoryIdParams = searchParams.get('categoryId');
    const debounceListWeight = useDebounce(listWeight, 500);

    const filterProductRef = useRef();
    const hanldRangeSlider = value => { setValueRange(value) }

    const handleClose = (e) => {
        if (!filterProductRef.current.contains(e.target) && isShow !== undefined) {
            setShow(false)
        }
    }
    const handleChecked = (index) => {
        setListWeight((prevListWeight) => {
            return prevListWeight.map((item, i) =>
                i === index ? { ...item, checked: !item.checked } : item
            );
        });
    }
    const fetchValueForFilter = () => {
        ProductService.getValueForFilter()
            .then(res => {
                if (res.status == 200) {
                    setPriceRange([res.data.minPrice, res.data.maxPrice])
                    setValueRange([res.data.minPrice, res.data.maxPrice])
                    setListWeight(() => res.data.listSize.map(size => ({ 'value': size, 'checked': false })))
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const handleFilterByPrice = (value) => {
        const minPrice = value[0] || valueRange[0]
        const maxPrice = value[1] || valueRange[1]
        const attributes = debounceListWeight.filter(w => w.checked).map(w => w.value) || ''
        searchParams.delete('page')
        if (minPrice === priceRange[0] && maxPrice === priceRange[1] && attributes.length === 0) {
            searchParams.delete('minPrice')
            searchParams.delete('maxPrice')
            searchParams.delete('attributes')
            navigate(`/product?${searchParams}`)
        } else {
            searchParams.set('minPrice', minPrice)
            searchParams.set('maxPrice', maxPrice)
            searchParams.set('attributes', attributes)
            navigate(`/product?${searchParams}`)

        }


    }
    useEffect(() => {
        console.log("hello");
        fetchValueForFilter();
    }, []);

    useEffect(() => {
        setValueRange([priceRange[0], priceRange[1]]);
        setListWeight(listWeight.map(weight => ({ ...weight, checked: false })));
    }, [keywordSearch, categoryIdParams]);

    const [firstRender, setFirstRender] = useState(true);
    useEffect(() => {
        if (JSON.stringify(priceRange) === JSON.stringify(valueRange)
            && debounceListWeight.filter(w => w.checked).length === 0 && firstRender) {
            return;
        }
        setFirstRender(false)

        handleFilterByPrice([])
    }, [debounceListWeight])

    return (
        <div className={cx('wrapper', { 'isShow': isShow, 'isFixed': isShow !== undefined })}
            onClick={handleClose}>
            <div className={cx('filter-product')} ref={filterProductRef}>
                <div className={cx('filter-price')}>
                    <h4>Lọc theo giá</h4>
                    <div className={cx('range-values')}>
                        <p><span className={cx('value')}>{valueRange[0]?.toLocaleString('vi-VN')}</span><span className={cx('currency')}>Đ</span></p>
                        <span>-</span>
                        <p><span className={cx('value')}>{valueRange[1]?.toLocaleString('vi-VN')}</span><span className={cx('currency')}>Đ</span></p>
                    </div>

                    <div className={cx('range-slider')}>
                        <Slider range min={priceRange[0]} max={priceRange[1]} value={valueRange} onChange={hanldRangeSlider}
                            onChangeComplete={handleFilterByPrice} />
                    </div>
                </div>

                <div className={cx('filter-other')}>
                    <h4>Trọng lượng</h4>
                    <div>
                        <ul className={cx('weight')}>
                            {listWeight.map((weight, index) => {
                                return (
                                    <li onClick={() => handleChecked(index)} key={index}>
                                        <CheckBox checked={listWeight[index].checked} />
                                        <p>{weight.value}</p>
                                    </li>
                                )
                            })}


                        </ul>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default memo(FilterProduct);