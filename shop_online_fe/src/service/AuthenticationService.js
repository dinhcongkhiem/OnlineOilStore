import axios from "axios";
import httpRequest from "../utills/httpRequest";
import {AUTH_URL, USER_URL} from './config'
class AuthenticationServiceClass {
  register = (data) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: AUTH_URL + '/register',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: data
    };
    return axios.request(config)
  }

  login = (data, isRemember) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: AUTH_URL + '/login?isRemember=' + isRemember,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    return axios.request(config)
  }

  logout = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: USER_URL + '/logout',
      withCredentials: true,

    };

    return httpRequest.request(config)
  }

  VerifyAccount = (verifyKey) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      withCredentials: true,
      url: AUTH_URL + '/verify?verifyKey=' + verifyKey,
    };

    return axios.request(config)
  }

  forgetPassword = (data) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      withCredentials: true,
      url: AUTH_URL + '/forget-password',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };

    return axios.request(config)
  }


  setNewPassword = (datas) => {
    let data = JSON.stringify({
      "newPassword": datas.newPassword
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      withCredentials: true,
      url: AUTH_URL + `/set-newpassword?email=${datas.email}&otp=${datas.verifyCode}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    return axios.request(config)
  }
}
const  AuthenticationService = new AuthenticationServiceClass();
export default AuthenticationService;
