package com.project.shop_online_be.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(columnDefinition = "TEXT")
    private String bannerUrl;
}