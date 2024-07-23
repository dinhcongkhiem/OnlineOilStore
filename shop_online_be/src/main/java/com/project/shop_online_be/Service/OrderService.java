package com.project.shop_online_be.Service;

import com.project.shop_online_be.Model.Address;
import com.project.shop_online_be.Model.OrderDetail;
import com.project.shop_online_be.Model.Orders;
import com.project.shop_online_be.Repository.OrderRepository;
import com.project.shop_online_be.Request.OrderRequest;
import com.project.shop_online_be.Response.OrderDetailResponse;
import com.project.shop_online_be.Response.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailService orderDetailService;
    private final UserService userService;
    private final AddressService addressService;


    public Page<OrderResponse> getOrder(Integer page,Date startDate, Date endDate ,List<Integer> statusFilter) {
        Pageable pageable = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "createDate"));
        Page<Orders> orders;
        if(startDate != null && endDate != null) {
             orders = orderRepository.findByStatusInAndCreateDateBetween(statusFilter,startDate, endDate,pageable);

        }else {
            orders = orderRepository.findByStatusIn(statusFilter,pageable);

        }
        return orders.map(this::convertToOrderResponse);
    }

    public OrderResponse createOrder(OrderRequest orderRequest) {
        Address address = addressService.createAddress(orderRequest.getAddress());
        Orders orders = Orders.builder()
                .address(address)
                .user(userService.getCurrentStudent())
                .deliveryFee(orderRequest.getDeliveryFee())
                .paymentType(orderRequest.getPaymentType())
                .buyer(orderRequest.getBuyer())
                .createDate(new Date())
                .updateDate(new Date())
                .status(0)
                .note(orderRequest.getNote())
                .build();
        this.orderRepository.save(orders);
        List<OrderDetail> orderDetailList = new ArrayList<>();

        orderRequest.getCarts().forEach(cart -> {
            orderDetailList.add(orderDetailService.insertOrderDetail(cart, orders));
        });


        AtomicReference<BigDecimal> totalPrice = new AtomicReference<>(orderRequest.getDeliveryFee());
        List<OrderDetailResponse> orderDetailResponseList = new ArrayList<>();
        orderDetailList.forEach(orderDetail -> {
            totalPrice.set(totalPrice.get().add(orderDetail.getTotalPrice()));
            orderDetailResponseList.add(orderDetailService.convertOrderToResponse(orderDetail));
        });

        orders.setTotalPrice(totalPrice.get());
        this.orderRepository.save(orders);

        return OrderResponse.builder()
                .id(orders.getId())
                .userId(orders.getUser().getId())
                .address(orders.getAddress())
                .deliveryFee(orders.getDeliveryFee())
                .paymentType(orders.getPaymentType())
                .totalPrice(orders.getTotalPrice())
                .orderDetails(orderDetailResponseList)
                .note(orders.getNote())
                .build();
    }

    public ResponseEntity<?> updateStatusOrder(int status, Long orderId) {
        Orders orders = this.orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy đơn hàng với ID: " + orderId));

        if (status != -1 && status != 0 && status != 1) {
            return ResponseEntity.badRequest().body("Invalid value");
        }
        orders.setStatus(status);
        orders.setUpdateDate(new Date());

        this.orderRepository.save(orders);
        return ResponseEntity.ok().build();
    }
    public Orders getById (Long orderId) {
        return orderRepository.findById(orderId).orElseThrow(NoSuchElementException::new);
    }

    public OrderResponse convertToOrderResponse(Orders order) {
        List<OrderDetailResponse> orderDetailResponseList = orderDetailService.findByOrder(order)
                .stream()
                .map(orderDetailService::convertOrderToResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .address(order.getAddress())
                .deliveryFee(order.getDeliveryFee())
                .paymentType(order.getPaymentType())
                .totalPrice(order.getTotalPrice())
                .orderDetails(orderDetailResponseList)
                .note(order.getNote())
                .buyer(order.getBuyer())
                .status(order.getStatus())
                .createDate(order.getCreateDate())
                .updateDate(order.getUpdateDate())
                .build();
    }
}
