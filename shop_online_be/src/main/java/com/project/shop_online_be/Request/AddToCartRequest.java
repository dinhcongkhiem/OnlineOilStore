package com.project.shop_online_be.Request;

import com.project.shop_online_be.Model.AttributeValue;
import com.project.shop_online_be.Model.ProductDetail;
import lombok.Data;

import java.util.List;

@Data
public class AddToCartRequest {
    private Integer quantity;
    private ProductDetail productDetail;
}
