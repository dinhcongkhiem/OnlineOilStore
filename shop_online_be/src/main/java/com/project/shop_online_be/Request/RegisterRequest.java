package com.project.shop_online_be.Request;

import com.project.shop_online_be.Enum.Role;
import com.project.shop_online_be.Model.Address;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String fullName;
    private String password;
    private String phoneNum;
    private Address address;
    private Role role;

}
