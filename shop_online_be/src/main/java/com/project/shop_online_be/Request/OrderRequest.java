package com.project.shop_online_be.Request;

import com.project.shop_online_be.Embeddable.Buyer;
import com.project.shop_online_be.Model.Address;
import com.project.shop_online_be.Model.Cart;
import com.project.shop_online_be.Response.CartResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private Address address;
    private BigDecimal deliveryFee;
    private Boolean paymentType;
    private List<Cart> carts;
    private Buyer buyer;
    private String note;
}
