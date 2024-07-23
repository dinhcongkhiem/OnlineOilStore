package com.project.shop_online_be.Model;

import com.project.shop_online_be.Embeddable.Buyer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User user;
    @Embedded
    private Buyer buyer;
    @ManyToOne
    private Address address;
    private BigDecimal deliveryFee;
    private Boolean paymentType;
    private BigDecimal totalPrice;
    private Integer status = 0; //0 = pending, -1 = cancel, 1 = successes
    private Date createDate;
    private Date updateDate;
    @Column(columnDefinition = "TEXT")
    private String note;

}

