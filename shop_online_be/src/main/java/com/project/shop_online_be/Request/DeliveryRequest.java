package com.project.shop_online_be.Request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;
@Data
public class DeliveryRequest {
    private Long orderId;
    private Integer isFreeship;
    private BigDecimal pickMoney;
    private String pickOption;
    private String transport;
    private Integer pickWorkShift;
    private Set<Integer> tags;
    private Float totalWeight;

}
