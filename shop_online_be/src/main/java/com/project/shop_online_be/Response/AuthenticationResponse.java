package com.project.shop_online_be.Response;

import com.project.shop_online_be.Enum.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private UserResponse user;

}
