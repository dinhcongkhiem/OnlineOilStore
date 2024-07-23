import httpRequest from "../utills/httpRequest";
import { ADMIN_URL } from "./config";
class AdminServiceClass {
    getOrders(page, statusFilter, startDate, endDate) {
        let pageRequest = 0;
        if (page) {
            pageRequest = page - 1;
        }
        let statusFilterRequest = '1,0,-1'
        if (statusFilter) {
            statusFilterRequest = statusFilter
        }
        let startDateRequest = "";
        if (startDate) {
            startDateRequest = startDate;
        }
        let endDateRequest = "";
        if (endDate) {
            endDateRequest = endDate;
        }
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: ADMIN_URL + '/order',
            withCredentials: true,
            params: {
                page: pageRequest, statusFilter: statusFilterRequest,
                startDate: startDateRequest, endDate: endDateRequest
            },
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return httpRequest.request(config)
    }
    changeStatusOrder(status, orderId) {
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: ADMIN_URL + '/order',
            withCredentials: true,
            params: { status: status, orderId: orderId },
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return httpRequest.request(config)
    }
    createDelivery(data) {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: ADMIN_URL + '/delivery',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        };
        return httpRequest.request(config)
    }

    getDeliveries(page, statusFilter, startDate, endDate) {
        let pageRequest = 0;
        if (page) {
            pageRequest = page - 1;
        }
        let statusFilterRequest = '-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,20,21,123,127,45,49,410'
        if (statusFilter) {
            statusFilterRequest = statusFilter
        }
        let startDateRequest = "";
        if (startDate) {
            startDateRequest = startDate;
        }
        let endDateRequest = "";
        if (endDate) {
            endDateRequest = endDate;
        }
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: ADMIN_URL + '/delivery',
            withCredentials: true,
            params: {
                page: pageRequest, statusFilter: statusFilterRequest,
                startDate: startDateRequest, endDate: endDateRequest
            }, headers: {
                'Content-Type': 'application/json',
            },
        };
        return httpRequest.request(config)
    }

    updateDeliveriesStatus(listAlias, page, statusFilter, startDate, endDate) {
        let pageRequest = 0;
        if (page) {
            pageRequest = page - 1;
        }
        let statusFilterRequest = '-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,20,21,123,127,45,49,410'
        if (statusFilter) {
            statusFilterRequest = statusFilter
        }
        let startDateRequest = "";
        if (startDate) {
            startDateRequest = startDate;
        }
        let endDateRequest = "";
        if (endDate) {
            endDateRequest = endDate;
        }
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: ADMIN_URL + '/delivery-update',
            withCredentials: true,
            params: {
                page: pageRequest, statusFilter: statusFilterRequest,
                startDate: startDateRequest, endDate: endDateRequest
            },
            data: listAlias,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return httpRequest.request(config)
    }

    cancelDelivery(deliveryAlias) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: ADMIN_URL + '/delivery-cancel',
            withCredentials: true,
            params: { deliveryAlias: deliveryAlias },
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return httpRequest.request(config)
    }
    getDeliveryExists(orderId) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: ADMIN_URL + '/delivery-exists',
            withCredentials: true,
            params: { orderId: orderId },
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return httpRequest.request(config)
    }

}
const AdminService = new AdminServiceClass()
export default AdminService;
