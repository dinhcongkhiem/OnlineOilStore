import httpRequest from "../utills/httpRequest";
import { CART_URL } from "./config";
class CartServiceClass {
    getProductsInCart = () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: CART_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
        return httpRequest.request(config)
    }
    addProductToCart = (data) => {
        console.log(data);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: CART_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            data: data
        };
        return httpRequest.request(config)
    }

    updateQuantityProductInCart = (cartId, quantity) => {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: CART_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { cartId: cartId, quantity: quantity },
            withCredentials: true,
        };
        return httpRequest.request(config)
    }

    removeProductFromCart = (cartId) => {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: CART_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            params: { cartId: cartId},
            withCredentials: true,
        };
        return httpRequest.request(config)
    }
}
const CartService = new CartServiceClass();
export default CartService;
