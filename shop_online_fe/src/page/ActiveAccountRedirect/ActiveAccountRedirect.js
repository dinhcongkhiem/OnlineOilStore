import { useEffect } from 'react';
import AuthenticationService from '../../service/AuthenticationService';
import {useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function ActiveAccountRedirect() {
    const navigate = useNavigate();
    const [queryParameters] = useSearchParams()
    useEffect(() => {
        AuthenticationService.VerifyAccount(queryParameters.get("activeKey"))
            .then((response) => {
                if (response.status === 200) {
                    toast.success("Kích hoạt tài khoản thành công", {
                        position: "top-center",
                    });
                    navigate('/');
                }
            })
            .catch((error) => {
                toast.warning("Không thể kích hoạt tài khoản", {
                    position: "top-center",
                });
                navigate('/');
            });


    }, []);

    return null;
}
