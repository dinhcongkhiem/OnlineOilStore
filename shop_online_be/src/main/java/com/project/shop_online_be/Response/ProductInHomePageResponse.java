package com.project.shop_online_be.Response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProductInHomePageResponse {
    private Long categoryId;
    private String categoryName;
    private String categoryBannerUrl;
    private List<ProductResponse> products;
}
