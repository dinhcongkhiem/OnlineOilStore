import classNames from "classnames/bind";
import PropTypes from 'prop-types';

import style from './ButtonComp.module.scss'
import { memo, useEffect } from "react";
const cx = classNames.bind(style)
function ButtonComp({ onClick, children, outline, cssClass, ...passprop}) {
    useEffect(() => {
        console.log('re-render');
    },[])
    return (
        <button onClick={onClick} className={cx('btn',cssClass, {'outline' : outline})} {...passprop}>
            {children}
        </button>
    );
}
ButtonComp.propTypes = {
    children: PropTypes.node.isRequired,
    outline: PropTypes.bool,
    cssClass: PropTypes.string
    
};


export default memo(ButtonComp);