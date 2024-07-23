package com.project.shop_online_be.Model;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer availableQuantity;
    @ManyToOne
    private Category category;
    @OneToOne
    private Description description;
    private Date createDate;
    @OneToMany(mappedBy = "product")
    private List<ProductDetail> productDetails;

}
