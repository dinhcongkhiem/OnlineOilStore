import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import style from './Input.module.scss'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(style);
function Input({ type, placeholder, inputType, value, readOnly,
    setValue, err, CssClass, errContent, placementTooltip, zIndex, ...passProps }) {
    let Comp = 'input'
    if (type) {
        Comp = type;
    }
    let placement = 'top-start'
    if (placementTooltip) {
        placement = placementTooltip;
    }

    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [isShowPass, setIsShowPass] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(max-width: 740px)').matches) {
            setIsMobileDevice(true);

        } else {
            setIsMobileDevice(false);
        }
    }, [])
    return (

        <Tippy
            visible={err !== undefined && err && errContent !== null && !isMobileDevice}
            content={errContent ? errContent : `Vui lòng nhập ${placeholder.toLowerCase()}`}
            placement={placement}
            className={cx('tooltip')}
            arrow={false}
            zIndex={zIndex ? zIndex : 1000}>
            <div className={cx(CssClass, 'wrapper-input')} {...passProps}>
                <Comp
                    readOnly={readOnly}
                    type={inputType === 'password' ? (isShowPass ? 'text' : 'password') : inputType}
                    placeholder={placeholder}
                    value={value}
                    className={cx('input-component', { 'err': err })}
                    onChange={(e) => setValue(e.target.value)} />
                {inputType === 'password'
                    && (
                        <FontAwesomeIcon
                            icon={isShowPass ? faEye : faEyeSlash}
                            className={cx('eye-icon')}
                            onClick={() => setIsShowPass(!isShowPass)} />

                    )
                }
            </div>


        </Tippy>

    );
}

Input.propTypes = {
    value: PropTypes.node.isRequired,
    setValue: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    CssClass: PropTypes.string,
    errContent: PropTypes.string,
    placementTooltip: PropTypes.string,
    zIndex: PropTypes.number,
    inputType: PropTypes.string

};


export default memo(Input);
