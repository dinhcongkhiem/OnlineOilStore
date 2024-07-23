import axios from "axios";
import {CONTACT_URL} from './config'
class ContactServiceClass {
    sendContact = (data) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: CONTACT_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: data
    };
    return axios.request(config)
  }

  
}
const  ContactService = new ContactServiceClass();
export default ContactService;
