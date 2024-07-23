package com.project.shop_online_be.Service;


import com.project.shop_online_be.Model.*;
import com.project.shop_online_be.Repository.AttributeValueRepository;
import com.project.shop_online_be.Repository.OrderDetailRepository;
import com.project.shop_online_be.Request.OrderDetailRequest;
import com.project.shop_online_be.Response.CartResponse;
import com.project.shop_online_be.Response.OrderDetailResponse;
import com.project.shop_online_be.Response.ProductInCartResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService {
    private final OrderDetailRepository orderDetailRepository;
    private final ProductService productService;
    private final ProductDetailService productDetailService;
    private final CartService cartService;

    public OrderDetail insertOrderDetail(Cart cartRequest, Orders orders) {
        Cart cart ;
        if(cartRequest.getId() != null) {
            cart = cartService.findById(cartRequest.getId());
        }else {
            cart = cartRequest;
        }
        OrderDetail orderDetail = OrderDetail.builder()
                .order(orders)
                .productDetail(cart.getProductDetail())
                .quantity(cart.getQuantity())
                .totalPrice(cart.getProductDetail().getPrice().multiply(BigDecimal.valueOf(cart.getQuantity())))
                .build();
        orderDetailRepository.save(orderDetail);
        if(cartRequest.getId() != null) {
            cartService.removeFromCart(cartRequest.getId());
        }
        return orderDetail;
    }


    public List<OrderDetail> findByOrder(Orders orders) {
        return orderDetailRepository.findByOrder(orders);
    }

    public OrderDetailResponse convertOrderToResponse(OrderDetail orderDetail) {
        ProductDetail p = productDetailService.findById(orderDetail.getProductDetail().getId());
        return OrderDetailResponse.builder()
                .id(orderDetail.getId())
                .productDetail(ProductInCartResponse
                        .builder()
                        .id(p.getId())
                        .price(p.getPrice())
                        .nameProduct(p.getProduct().getName())
                        .weight(p.getWeight())
                        .color(p.getColor())
                        .images(p.getImages())
                        .build())
                .quantity(orderDetail.getQuantity())
                .totalPrice(orderDetail.getTotalPrice())
                .build();
    }

}
