package com.project.shop_online_be.Response;

import com.project.shop_online_be.Enum.Role;
import com.project.shop_online_be.Model.Address;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import org.hibernate.annotations.NaturalId;

@Data
@Builder
public class UserResponse {
    private String fullName;
    private String email;
    private String phoneNum;
    private Address address;
    private Role role;
}
