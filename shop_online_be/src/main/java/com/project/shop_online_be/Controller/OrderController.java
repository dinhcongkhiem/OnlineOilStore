package com.project.shop_online_be.Controller;

import com.project.shop_online_be.Request.OrderRequest;
import com.project.shop_online_be.Response.OrderResponse;
import com.project.shop_online_be.Service.DeliveryService;
import com.project.shop_online_be.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/order")
public class OrderController {
    private final OrderService orderService;
    private final DeliveryService deliveryService;


    @PostMapping()
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            return ResponseEntity.ok(orderService.createOrder(orderRequest));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("delivery-fee")
    public ResponseEntity<?> getDeliveryFee(
            @RequestParam String province,
            @RequestParam String district,
            @RequestParam String ward,
            @RequestParam String address) {
        return ResponseEntity.ok(deliveryService.getShipmentFee(
                province,
                district,
                ward,
                address,
                1000,
                0,
                "road",
                "none",
                new Integer[0]
        ));
    }

}
