package com.project.shop_online_be.Request;

import lombok.Data;

@Data
public class RefreshAccessTokenRequest {
    private String refreshToken;
}
