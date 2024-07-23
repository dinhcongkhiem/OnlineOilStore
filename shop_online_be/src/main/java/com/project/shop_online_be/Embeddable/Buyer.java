package com.project.shop_online_be.Embeddable;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Buyer {
    private String fullName;
    private String email;
    private String phoneNum;
}

