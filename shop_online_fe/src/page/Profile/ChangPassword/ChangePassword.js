import classNames from 'classnames/bind';

import Input from '../../../component/Input'
import ButtonComp from '../../../component/ButtonComp'

import style from '../Profile.module.scss'
import { useState } from 'react';
import { validateInputChangePass } from '../../../utills/ValidateInputs';
import { ModalAuthen, ModalLoading } from '../../../layouts/component/Modal';
import UserSevice from '../../../service/UserSevice';
import { toast } from 'react-toastify';
const cx = classNames.bind(style);
function ChangePassword() {
    const [isOpenModalAuthen, setOpenModalAuthen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [listErr, setListErr] = useState({
        password: false,
        newPassword: false,
        confirmPassword: {
            required: false,
            match: false
        },
    });

    const handleChangePassword = () => {
        console.log(validateInputChangePass(
            listErr,
            {
                password, newPassword, confirmPassword
            }, setListErr));
        if (validateInputChangePass(
            listErr,
            {
                password, newPassword, confirmPassword
            }, setListErr)) {
                
            setIsLoading(true);
            const data = {
                oldPassword: password,
                newPassword: newPassword,
                confirmNewPassword: confirmPassword
            }

            UserSevice.changePassword(data)
                .then(() => {
                    toast.success('Thành công.')
                    setPassword('');
                    setNewPassword('');
                    setConfirmPassword('');

                })
                .catch((error) => {
                    if (error.response.data === 'Wrong password') {
                        toast.error('Mật khẩu không chính xác.')
                    } else if (error.response.data === 'Password are not the same') {
                        toast.error('Mật khẩu xác nhận không khớp.')
                    } else {
                        toast.error('Có lỗi xảy ra vui lòng thử lại.')
                    }
                }).finally(() => {
                    setIsLoading(false);
                })
        }
    }

    return (
        <div className={cx('wrapper-user-info')}>
            <h3 className={cx('title')}>Thay đổi mật khẩu</h3>
            <div className={cx('content')}>
                <div className={cx('row', 'd-flex', 'position-relative')}>
                    <label style={{ flexBasis: '40%' }}>Mật khẩu cũ</label>
                    <Input
                        value={password}
                        setValue={setPassword}
                        inputType={'password'}
                        err={listErr.password}
                        placeholder="Mật khẩu cũ"
                        placementTooltip='top-end'
                        style={{ flexBasis: '60%' }} />

                </div>
                <div className={cx('row', 'd-flex', 'position-relative')}>
                    <label style={{ flexBasis: '40%' }}>Mật khẩu mới</label>
                    <Input
                        value={newPassword}
                        setValue={setNewPassword}
                        inputType={'password'}
                        style={{ flexBasis: '60%' }}
                        err={listErr.newPassword}
                        placeholder="Mật khẩu mới"
                        placementTooltip='top-end' />


                </div>
                <div className={cx('row', 'd-flex', 'position-relative')}>
                    <label style={{ flexBasis: '40%' }}>
                        Xác nhận mật khẩu
                    </label >
                    <Input
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        inputType={'password'}
                        style={{ flexBasis: '60%' }}
                        err={listErr.confirmPassword.required || listErr.confirmPassword.match}
                        errContent={listErr.confirmPassword.match && !listErr.confirmPassword.required ? 'Mật khẩu xác nhận không khớp' : ''}
                        placeholder="Xác nhận mật khẩu"
                        placementTooltip='top-end' />


                </div>

                <a onClick={() => setOpenModalAuthen(true)} className={cx('ques-forget')}>Bạn quên mật khẩu?</a>
                <ButtonComp outline={true} onClick={handleChangePassword}>Lưu thay đổi</ButtonComp>


            </div>
            <ModalAuthen setOpen={setOpenModalAuthen} isOpen={isOpenModalAuthen} startLayout={'forgetpassword'} />
            <ModalLoading isLoading={isLoading} />
        </div>
    );
}

export default ChangePassword;