import axios from "axios";
import { PRODUCT_URL } from "./config";

class ProductServiceClass {
    getProduct(page, orderBy) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL,
            params: {page: page, orderBy: orderBy},
            withCredentials: true,
        };

        return axios.request(config)
    }
    searchProduct(data, orderBy) {
        let page = 0;
        if(data.page){
            page = data.page - 1;
        }
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL + '/search',
            params:
            {
                minPrice: data.minPrice || '',
                maxPrice: data.maxPrice || '',
                keyword: data.keyword || '',
                attributes: data.attributes || '',
                orderBy: orderBy,
                page: page
            },
            withCredentials: true,
        };

        return axios.request(config)
    }

    searchProductByCategory(data, orderBy) {
        let page = 0;
        if(data.page){
            page = data.page - 1;
        }
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL + '/by-category',
            params:
            {
                minPrice: data.minPrice || '',
                maxPrice: data.maxPrice || '',
                categoryId: data.categoryId || '',
                attributes: data.attributes || '',
                orderBy: orderBy,
                page: page
            },
            withCredentials: true,
        };

        return axios.request(config)
    }

    getProductDetail(id) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL + '/detail?id=' + id,
            withCredentials: true,
        };

        return axios.request(config)
    }
    getHotDealProduct() {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL + '/hot-deal',
            withCredentials: true,
        };

        return axios.request(config)
    }
    getTopCategory() {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL + '/home',
            withCredentials: true,
        };
        return axios.request(config)
    }

    getTheSameCategory(categoryId, productId) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL + '/same-cate',
            params: { categoryId: categoryId, productId: productId },
            withCredentials: true,
        };
        return axios.request(config)
    }

    getValueForFilter() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: PRODUCT_URL + '/value-for-filter',
            withCredentials: true,
        };
        return axios.request(config)
    }

}
const ProductService = new ProductServiceClass();
export default ProductService;
