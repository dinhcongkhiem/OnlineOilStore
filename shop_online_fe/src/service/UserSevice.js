import httpRequest from '../utills/httpRequest';
import {USER_URL} from './config'
class UserServiceClass {
  changeUserInfo = (data) => {
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: USER_URL,
        withCredentials: true,
        headers: { 
          'Content-Type': 'application/json', 
        },
        data : {...data, role: "USER"}
      };
      
    return httpRequest.request(config)
  }

  changePassword = (data) => {
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      withCredentials: true,
      url: USER_URL + '/change-pass',
      headers: { 
        'Content-Type': 'application/json', 
      },
      data : data
    };
    
    return httpRequest.request(config)
   
  }

}
const  UserService = new UserServiceClass();
export default UserService;
