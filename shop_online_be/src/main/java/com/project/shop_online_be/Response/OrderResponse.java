package com.project.shop_online_be.Response;

import com.project.shop_online_be.Embeddable.Buyer;
import com.project.shop_online_be.Model.Address;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private Address address;
    private BigDecimal deliveryFee;
    private Boolean paymentType;
    private BigDecimal totalPrice;
    private List<OrderDetailResponse> orderDetails;
    private String note;
    private Buyer buyer;
    private Integer status;
    private Date createDate;
    private Date updateDate;
}
