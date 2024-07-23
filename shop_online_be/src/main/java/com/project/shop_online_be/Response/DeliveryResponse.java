package com.project.shop_online_be.Response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DeliveryResponse {

    private Long id;
    private OrderResponse orders;
    private String deliveryCode;
    private String deliveryAlias;
    private Integer isFreeship;
    private BigDecimal pickMoney;
    private BigDecimal deliveryFee;
    private BigDecimal insuranceFee;
    private BigDecimal total;
    private Integer status;
    private String estimatedPickTime;
    private String estimatedDeliverTime;
}
