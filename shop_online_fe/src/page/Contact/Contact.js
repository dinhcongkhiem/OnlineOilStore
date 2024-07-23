import classNames from "classnames/bind";
import style from './Contact.module.scss'
import Input from "../../component/Input";
import ButtonComp from "../../component/ButtonComp";

import { useState } from "react";
import ContactService from "../../service/ContactService";
import { toast } from "react-toastify";
import { ModalLoading } from "../../layouts/component/Modal";

const cx = classNames.bind(style)
function Contact() {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [content, setContent] = useState('');
    const [listErr, setListErr] = useState({
        name: false,
        address: false,
        email: false,
        emailFormat: false,
        phoneNum: false,
        content: false
    });
    const hanldSendFeedBack = () => {
        setLoading(true)
        if(validateInputs() ) {
            ContactService.sendContact({ fullName: name, address, email, phoneNum, content })
            .then(res => {
                if(res.status === 200){
                    toast.success("Đã gửi yêu cầu của bạn.")
                }
            }).catch(err => {
                console.log(err);
            }).finally(() => setLoading(false))
        }

    }
    const validateInputs = () => {
        let isValid = true;
        const newListErr = { ...listErr };

        if (name.trim().length === 0) {
            newListErr.name = true;
            isValid = false;
        } else {
            newListErr.name = false;
        }

        if (address.trim().length === 0) {
            newListErr.address = true;
            isValid = false;
        } else {
            newListErr.address = false;
        }

        if (email.trim().length === 0) {
            newListErr.email = true;
            isValid = false;
        } else {
            newListErr.email = false;
        }
        if(!validateEmail(email) && email.trim().length !== 0) {
            newListErr.emailFormat = true;
            isValid = false;

        }else {
            newListErr.emailFormat = false;

        }

        if (phoneNum.trim().length === 0) {
            newListErr.phoneNum = true;
            isValid = false;
        } else {
            newListErr.phoneNum = false;
        }

        if (content.trim().length === 0) {
            newListErr.content = true;
            isValid = false;
        } else {
            newListErr.content = false;
        }
        setListErr(newListErr);
        return isValid;
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    console.log('re-render');
    return (
        <div className={cx('wrapper')}>
            <div className={cx('contact-info')}>
                <p>Trân trọng cảm ơn Quý khách đã quan tâm tới sản phẩm của chúng tôi</p>
                <p>Để đánh giá sản phẩm, dịch vụ Quý khách hàng liên hệ hotline: <strong>1900 75 75 25<br />
                </strong></p>
                <p>Để đóng góp ý kiến Quý khách hàng liên hệ hotline: <strong>0938 828 257</strong></p>
                <p>Để đăng ký làm Nhà Phân Phối / Đại Lý, Quý khách hàng liên hệ hotline: <strong>0938 828 257</strong></p>

                <div className={cx('contact-detail')}>
                    <p>Quý khách có thể gửi thư để liên hệ với chúng tôi từ website này bằng cách điền thông tin vào mẫu bên dưới hoặc liên hệ trực tiếp tới số điện thoại&nbsp;<strong> 0938 828 257 (Mr Sang)</strong>, chúng tôi sẽ nhanh chóng liên hệ với Quý khách trong thời gian sớm nhất. Xin cảm ơn quý khách hàng.</p>

                </div>
            </div>

            <div className={cx('contact-form')}>
                <div className={cx('wrapper-form')}>
                    <h3>GỬI YÊU CẦU</h3>
                    <div className={cx('form')}>

                        <div className={cx('col')}>
                            <Input value={name} setValue={setName} placeholder={'Họ và tên'} err={listErr.name} />
                        </div >
                        <div className={cx('col')}>
                            <Input value={address} setValue={setAddress} placeholder="Địa chỉ" err={listErr.address}/>
                        </div>
                        <div className={cx('col-2')}>
                            <Input value={email} setValue={setEmail} placeholder="Email" inputType={'email'}
                                errContent={listErr.emailFormat ? 'Vui lòng nhập đúng định dạng email' : null} err={!listErr.email ? listErr.emailFormat : listErr.email}/>
                        </div>
                        <div className={cx('col-2')}>
                            <Input value={phoneNum} setValue={setPhoneNum} placeholder="Số điện thoại" 
                            inputType={'number'} err={listErr.phoneNum}/>

                        </div>
                        <div className={cx('col', 'textarea')}>
                            <Input value={content} setValue={setContent} placeholder="Nội dung" type={'textarea'} err={listErr.content}/>
                        </div>
                        <div className={cx('col')}>
                            <ButtonComp onClick={hanldSendFeedBack}>GỬI</ButtonComp>
                        </div>
                    </div>
                </div>
                <div className={cx('location')}>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.917427776475!2d105.66976041914944!3d20.83504057811932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134494ea9a1f65f%3A0x2337a9f757cbbfb!2zVUJORCB4w6MgVHLhuqduIFBow7o!5e0!3m2!1svi!2s!4v1719557325445!5m2!1svi!2s"
                        width="600" height="450"
                        style={{ border: 'none' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
            <ModalLoading isLoading={loading}/>
        </div>
    );
}

export default Contact; 