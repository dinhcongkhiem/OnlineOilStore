package com.project.shop_online_be.Response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ValueForFilterResponse {
    private BigDecimal maxPrice;
    private BigDecimal minPrice;
    private List<Float> listSize;
}
