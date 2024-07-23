package com.project.shop_online_be.Request;

import lombok.Data;

@Data
public class ContactRequest {
    private String fullName;
    private String address;
    private String email;
    private String phoneNum;
    private String content;
}
