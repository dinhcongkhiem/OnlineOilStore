package com.project.shop_online_be.Response;

import com.project.shop_online_be.Model.AttributeValue;
import com.project.shop_online_be.Model.ProductDetail;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OrderDetailResponse {
    private Long id;
    private ProductInCartResponse productDetail;
    private Integer quantity;
    private BigDecimal totalPrice;

}
