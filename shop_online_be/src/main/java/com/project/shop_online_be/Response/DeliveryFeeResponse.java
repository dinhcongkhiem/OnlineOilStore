package com.project.shop_online_be.Response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DeliveryFeeResponse {
    private BigDecimal deliveryFee;
}
