package com.project.shop_online_be.Response;

import com.project.shop_online_be.Model.Category;
import com.project.shop_online_be.Model.Description;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductInfoResponse {
    private Long productId;
    private String name;
    private Integer availableQuantity;
    private Category category;
    private Description description;
    private List<ProductDetailResponse> productDetails;
}

