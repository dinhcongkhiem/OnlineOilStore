package com.project.shop_online_be.Response;

import com.project.shop_online_be.Model.Category;
import com.project.shop_online_be.Model.ImageProduct;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;


@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private BigDecimal maxPrice;
    private BigDecimal minPrice;
    private ImageProduct image;
    private Category category;
}
