package com.project.shop_online_be.Model;

import com.project.shop_online_be.Embeddable.Color;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal price;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private Float weight;
    @Embedded
    private Color color;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "product_detail_images",
            joinColumns = @JoinColumn(name = "product_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "image_product_id")
    )
    private List<ImageProduct> images;

}
