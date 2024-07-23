import classNames from "classnames/bind";
import styles from './NavItems.module.scss'
import Tippy from "@tippyjs/react/headless";
import { memo, useEffect } from "react";
import { useSpring, motion } from "framer-motion";
const cx = classNames.bind(styles);
function NavItem({ items ,...passProp}) {
    const springConfig = { damping: 15, stiffness: 100 };
    const opacity = useSpring(0, springConfig);

    function onMount() {
        opacity.set(1);
    }

    function onHide() {
        opacity.set(0);
    }
    useEffect(() => {
        console.log('re-render');
    }, []);
    return (
        <div className={cx('wrapper')}>
            {
                items.subItem != undefined ?
                    <Tippy
                        interactive
                        placement="right-start"
                        animation={true}
                        onMount={onMount}
                        onHide={onHide}
                        render={(attrs) => (
                            <motion.ul style={{ opacity }} className={cx('sub-menu')} {...attrs}>
                                <div className={cx('arrow')}></div>
                                {items.subItem.map((subItem, index) => (
                                    <NavItem items={subItem} key={index} />
                                ))}

                            </motion.ul>
                        )}>
                        <li>
                            <a
                                {...passProp}
                                className={cx('title')}>
                                {items.title}
                            </a>
                        </li>
                    </Tippy>
                    : <li>
                        <a  {...passProp} className={cx('title')}>{items.name}</a>
                    </li>

            }
        </div>
    );
}

export default memo(NavItem);

