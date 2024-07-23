import httpRequest from "../utills/httpRequest";
import { ORDERS_URL } from "./config";
class OrdersServiceClass {
    createOrder(data) {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: ORDERS_URL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        };

        return httpRequest.request(config)
    }

    getDeliveryFee(data) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: ORDERS_URL + '/delivery-fee',
            withCredentials: true,
            params: data,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        return httpRequest.request(config)
    }
}
const OrdersService = new OrdersServiceClass()
export default OrdersService;
