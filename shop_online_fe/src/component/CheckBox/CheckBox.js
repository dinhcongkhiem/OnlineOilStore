import classNames from "classnames/bind";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import style from './CheckBox.module.scss'
import { memo } from "react";
const cx = classNames.bind(style);
function CheckBox({checked,cssClass, ...passprop}) {
    return ( 
        <div className={cx('wrapper', cssClass, {'checked': checked})} {...passprop}>
            <FontAwesomeIcon icon={faCheck} />

        </div>
     );
}

export default memo(CheckBox);