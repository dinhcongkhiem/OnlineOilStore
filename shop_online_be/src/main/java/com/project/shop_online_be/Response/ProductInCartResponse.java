package com.project.shop_online_be.Response;

import com.project.shop_online_be.Embeddable.Color;
import com.project.shop_online_be.Model.ImageProduct;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Data
public class ProductInCartResponse {

    private Long id;
    private BigDecimal price;
    private String nameProduct;
    private Integer availableQuantity;
    private Float weight;
    private Color color;
    private List<ImageProduct> images;
}
