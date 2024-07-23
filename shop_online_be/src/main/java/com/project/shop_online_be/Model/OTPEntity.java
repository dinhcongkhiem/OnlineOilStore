package com.project.shop_online_be.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OTPEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String otp;
    private Date issuedAt;
    private Date expiration;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
