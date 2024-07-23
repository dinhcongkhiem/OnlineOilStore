package com.project.shop_online_be.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.shop_online_be.Model.Delivery;
import com.project.shop_online_be.Model.OrderDetail;
import com.project.shop_online_be.Model.Orders;
import com.project.shop_online_be.Repository.DeliveryRepository;
import com.project.shop_online_be.Request.DeliveryRequest;
import com.project.shop_online_be.Response.DeliveryFeeResponse;
import com.project.shop_online_be.Response.DeliveryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    @Value("${delivery.apiKey}")
    private String apiKey;
    @Value("${delivery.apiURL}")
    private String apiURL;
    @Value("${delivery.pickInfo.pickName}")
    private String pickName;
    @Value("${delivery.pickInfo.pickTel}")
    private String pickTell;
    @Value("${delivery.addressDefault.pickProvince}")
    private String pickProvince;
    @Value("${delivery.addressDefault.pickDistrict}")
    private String pickDistrict;
    @Value("${delivery.addressDefault.pickWard}")
    private String pickWard;
    @Value("${delivery.addressDefault.pickAddress}")
    private String pickAddress;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final OrderService orderService;
    private final DeliveryRepository deliveryRepository;
    private final OrderDetailService orderDetailService;

    public DeliveryFeeResponse getShipmentFee(
            String province,
            String district,
            String ward,
            String address,
            Integer weight,
            Integer value,
            String transport,
            String deliverOption,
            Integer[] tags) {
        StringBuilder urlBuilder = new StringBuilder(apiURL);
        urlBuilder.append("/services/shipment/fee?");
        appendQueryParam(urlBuilder, "pick_province", pickProvince);
        appendQueryParam(urlBuilder, "pick_district", pickDistrict);
        appendQueryParam(urlBuilder, "pick_ward", pickWard);
        appendQueryParam(urlBuilder, "pick_address", pickAddress);
        appendQueryParam(urlBuilder, "province", province);
        appendQueryParam(urlBuilder, "district", district);
        appendQueryParam(urlBuilder, "ward", ward);
        appendQueryParam(urlBuilder, "address", address);
        appendQueryParam(urlBuilder, "weight", String.valueOf(weight));
        appendQueryParam(urlBuilder, "value", String.valueOf(value));
        appendQueryParam(urlBuilder, "transport", transport);
        appendQueryParam(urlBuilder, "deliver_option", deliverOption);
        for (int tag : tags) {
            appendQueryParam(urlBuilder, "tags[]", String.valueOf(tag));
        }
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(urlBuilder.toString(), HttpMethod.GET, entity, String.class);
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode feeNode = root.get("fee");
            if (feeNode != null && !feeNode.isNull()) {
                BigDecimal fee = BigDecimal.valueOf(feeNode.get("fee").asInt());

                return DeliveryFeeResponse.builder()
                        .deliveryFee(fee)
                        .build();
            } else {
                throw new RuntimeException("'fee' node not found or is null in JSON");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON", e);
        }
    }

    public Boolean cancelDelivery (String deliveryAlias) {
        try {

            String urlRequest = apiURL + "/services/shipment/cancel/" + deliveryAlias;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", apiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(urlRequest, HttpMethod.POST, entity, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            System.out.println(responseJson);
            return  responseJson.get("success").asBoolean();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
    public Page<DeliveryResponse> handleUpdateStatus(List<String> deliveriesAlias,
                                                     Integer page, Date startDate,
                                                     Date endDate, List<Integer> statusFilter) {
        deliveriesAlias.forEach(d -> {
            Delivery delivery = deliveryRepository.findByDeliveryAlias(d).orElseThrow(NoSuchElementException::new);
            delivery.setStatus(updateStatus(d));
            deliveryRepository.save(delivery);
        });
        return getDeliveries(page,startDate,endDate,statusFilter);
    }
    public Integer updateStatus(String deliveryAlias)  {
        try {

            String urlRequest = apiURL + "/services/shipment/v2/" + deliveryAlias;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", apiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(urlRequest, HttpMethod.GET, entity, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            System.out.println(responseJson);
            JsonNode orderResponse = responseJson.get("order");
            return orderResponse.get("status").asInt();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] printLabel(String deliveryAlias) {

            String urlRequest =  "https://services.giaohangtietkiem.vn/services/label/" + deliveryAlias;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", apiKey);
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<byte[]> response = restTemplate.exchange(urlRequest, HttpMethod.GET, entity, byte[].class);


            return response.getBody();

    }

    public Page<DeliveryResponse> getDeliveries(Integer page, Date startDate, Date endDate, List<Integer> statusFilter) {
        Pageable pageable = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "createDate"));
        Page<Delivery> responsePage;
        if (startDate != null && endDate != null) {
            responsePage = deliveryRepository.
                    findByStatusInAndCreateDateBetween(statusFilter, startDate, endDate, pageable);
        } else {
            responsePage = deliveryRepository.
                    findByStatusIn(statusFilter, pageable);
        }
        return responsePage.map(this::convertToResponse);
    }

    public DeliveryResponse convertToResponse(Delivery delivery) {
        return DeliveryResponse
                .builder()
                .id(delivery.getId())
                .orders(orderService.convertToOrderResponse(delivery.getOrders()))
                .deliveryCode(delivery.getDeliveryCode())
                .deliveryAlias(delivery.getDeliveryAlias())
                .isFreeship(delivery.getIsFreeship())
                .pickMoney(delivery.getPickMoney())
                .deliveryFee(delivery.getDeliveryFee())
                .insuranceFee(delivery.getInsuranceFee())
                .total(delivery.getTotal())
                .status(delivery.getStatus())
                .estimatedPickTime(delivery.getEstimatedPickTime())
                .estimatedDeliverTime(delivery.getEstimatedDeliverTime())
                .build();

    }

    public Boolean createDelivery(DeliveryRequest deliveryRequest) {
        try {

            Orders orders = orderService.getById(deliveryRequest.getOrderId());
            System.out.println(deliveryRequest);
            JsonNode response = createDeliveryInGHTK(orders, deliveryRequest);
            Boolean isSuccess = response.get("success").asBoolean();
            JsonNode orderResponse = response.get("order");
            if (isSuccess) {
                deliveryRepository.save(Delivery
                        .builder()
                        .orders(orders)
                        .deliveryCode(orderResponse.get("partner_id").asText())
                        .deliveryAlias(orderResponse.get("label").asText())
                        .isFreeship(deliveryRequest.getIsFreeship())
                        .pickMoney(deliveryRequest.getPickMoney())
                        .deliveryFee(BigDecimal.valueOf(orderResponse.get("fee").asLong()))
                        .insuranceFee(BigDecimal.valueOf(orderResponse.get("insurance_fee").asLong()))
                        .total(deliveryRequest.getPickMoney().add(BigDecimal.valueOf(orderResponse.get("fee").asLong())))
                        .estimatedPickTime(orderResponse.get("estimated_pick_time").asText())
                        .estimatedDeliverTime(orderResponse.get("estimated_deliver_time").asText())
                        .status(orderResponse.get("status_id").asInt())
                        .createDate(new Date())
                        .build());
            }
            return isSuccess;

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    public JsonNode createDeliveryInGHTK(Orders orders, DeliveryRequest deliveryRequest) throws JsonProcessingException {
        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> products = new ArrayList<>();

        List<OrderDetail> orderDetailList = orderDetailService.findByOrder(orders);
        orderDetailList.forEach(orderDetail -> {
            products.add(createProduct(orderDetail));
        });

        requestBody.put("order", createOrder(orders, deliveryRequest));
        requestBody.put("products", products);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(apiURL + "/services/shipment/order/?ver=1.5", HttpMethod.POST, entity, String.class);
        System.out.println(requestBody);
        System.out.println(entity);
        System.out.println(response);
        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("Shipment order created successfully");
        } else {
            System.out.println("Failed to create shipment order");
        }
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readTree(response.getBody());

    }

    private Map<String, Object> createProduct(OrderDetail orderDetail) {
        Map<String, Object> product = new HashMap<>();
        product.put("name", orderDetail.getProductDetail().getProduct().getName());
        product.put("price", orderDetail.getProductDetail().getPrice());
        product.put("weight", orderDetail.getProductDetail().getWeight());
        product.put("quantity", orderDetail.getQuantity());
        product.put("product_code", "");
        return product;
    }

    private Map<String, Object> createOrder(Orders orders, DeliveryRequest deliveryRequest) {
        Map<String, Object> DeliveryOrder = new HashMap<>();
        DeliveryOrder.put("id", orders.getId() + "" + getRandomNumbers());
        DeliveryOrder.put("pick_name", pickName);
        DeliveryOrder.put("pick_address", pickAddress);
        DeliveryOrder.put("pick_province", pickProvince);
        DeliveryOrder.put("pick_district", pickDistrict);
        DeliveryOrder.put("pick_tel", pickTell);

        DeliveryOrder.put("name", orders.getBuyer().getFullName());
        DeliveryOrder.put("address", orders.getAddress().getAddressDetail());
        DeliveryOrder.put("province", orders.getAddress().getProvinces().getLabel());
        DeliveryOrder.put("district", orders.getAddress().getDistricts().getLabel());
        DeliveryOrder.put("ward", orders.getAddress().getCommunes().getLabel());
        DeliveryOrder.put("hamlet", "Khác");
        DeliveryOrder.put("tel", orders.getBuyer().getPhoneNum());

        DeliveryOrder.put("is_freeship", deliveryRequest.getIsFreeship());
        DeliveryOrder.put("total_weight", deliveryRequest.getTotalWeight());
        DeliveryOrder.put("pick_money", deliveryRequest.getPickMoney());
        DeliveryOrder.put("pick_work_shift", deliveryRequest.getPickWorkShift());
        DeliveryOrder.put("value", orders.getTotalPrice());
        DeliveryOrder.put("pick_option", deliveryRequest.getPickOption());
        DeliveryOrder.put("transport", deliveryRequest.getTransport());
        DeliveryOrder.put("tags", deliveryRequest.getTags());

        DeliveryOrder.put("note", orders.getNote());

        return DeliveryOrder;
    }

    public Boolean isExistsDelivery(Long orderId) {
        Orders orders = orderService.getById(orderId);
        Optional<Delivery> findExists = deliveryRepository.findByOrdersAndStatusNot(orders, -1);
        if (findExists.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    private void appendQueryParam(StringBuilder builder, String key, String value) {
        if (builder.charAt(builder.length() - 1) != '?') {
            builder.append('&');
        }
        builder.append(key).append('=').append(value);
    }

    private String getRandomNumbers() {
        Random random = new Random();
        int number = random.nextInt(999) + 1;
        return String.format("%03d", number);

    }

}
