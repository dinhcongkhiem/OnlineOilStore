package com.project.shop_online_be.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Orders orders;
    private String deliveryCode;
    private String deliveryAlias;
    private Integer isFreeship;
    private BigDecimal pickMoney; //thu hộ
    private BigDecimal deliveryFee;
    private BigDecimal insuranceFee;
    private BigDecimal total;
    private Integer status;
    private String estimatedPickTime;
    private String estimatedDeliverTime;
    private Date createDate;
}
