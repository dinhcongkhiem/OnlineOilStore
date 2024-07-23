import axios from "axios";
import { CATEGORY_URL } from "./config";
class CategoryServiceClass {
    getCategories() {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: CATEGORY_URL,
            withCredentials: true,
        };
          
         return axios.request(config)
    }
    


}
const CategoryService =  new CategoryServiceClass()
export default CategoryService;
