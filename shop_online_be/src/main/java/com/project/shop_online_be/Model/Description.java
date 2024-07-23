package com.project.shop_online_be.Model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@Entity
public class Description {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String state;
    private String ingredients;
    private String technical_standards;
    @Column(columnDefinition = "TEXT")
    private String role;
    private String applications;
    private String safety;
    private String storage;


}