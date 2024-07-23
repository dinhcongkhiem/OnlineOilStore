import classNames from "classnames/bind";
import PropTypes from 'prop-types';
import style from './PropertiesSelect.module.scss';
import { memo, useEffect, useState } from "react";
import Tippy from "@tippyjs/react";

const cx = classNames.bind(style);

function PropertiesSelect({ productDetails, selectedOptions, setSelectedOptions }) {
    const [listColor, setListColor] = useState();
    const [listWeight, setListWeight] = useState();
    useEffect(() => {
        if (productDetails && productDetails.length > 0) {
            const uniqueColors = Array.from(
                productDetails.reduce((map, productDetail) => {
                    map.set(productDetail?.color?.colorCode, productDetail.color);
                    return map;
                }, new Map()).values()
            );

            const uniqueWeights = Array.from(
                productDetails.reduce((map, productDetail) => {
                    map.set(productDetail.weight, productDetail.weight);
                    return map;
                }, new Map()).values()
            );
            
            setListColor(uniqueColors);
            setListWeight(uniqueWeights);
        }
    }, [productDetails]);
    return (
        <div className={cx('wrapper')}>
            {
                listColor && listColor[0]?.colorCode.length > 0 && 
                <div className={cx('property')}>
                <p className={cx('label')}>
                    Màu sắc
                </p>
                <div className={cx('options')}>
                    {listColor?.map((color, key) => (
                        color?.colorCode && 
                        <button
                        key={key}
                        className={cx('prop-value', {
                            'selected': selectedOptions.color === color
                        })}
                        onClick={() => {
                            setSelectedOptions((prev) => ({
                                ...prev,
                                color:  selectedOptions.color === color ? null : color
                            }));
                        }}
                        >
                            <Tippy content={color.nameColor}>
                                <span style={{ backgroundColor: color?.colorCode }}></span>
                            </Tippy>
                        </button>
                    ))}
                </div>
            </div>
            }
            
            <div className={cx('property')}>
                <p className={cx('label')}>
                    Trọng lượng
                </p>
                <div className={cx('options')}>
                    {listWeight?.map((weight, key) => (
                           <button
                           key={key}
                           className={cx('prop-value', {
                               'selected': selectedOptions.weight === weight
                           })}
                           onClick={() => {
                               setSelectedOptions((prev) => ({
                                   ...prev,
                                   weight:  selectedOptions.weight === weight ? null : weight
                               }));
                           }}
                           >
                        
                            <Tippy content={weight}>
                                <p>{weight} KG</p>
                            </Tippy>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

PropertiesSelect.propTypes = {
    productDetails: PropTypes.array,
    selectedOptions: PropTypes.object.isRequired,
    setSelectedOptions: PropTypes.func.isRequired
};

export default memo(PropertiesSelect);
