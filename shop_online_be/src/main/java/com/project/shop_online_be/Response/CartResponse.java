package com.project.shop_online_be.Response;


import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class CartResponse {
    private Long id;
    private ProductInCartResponse productDetail;
    private Integer quantity;

}
