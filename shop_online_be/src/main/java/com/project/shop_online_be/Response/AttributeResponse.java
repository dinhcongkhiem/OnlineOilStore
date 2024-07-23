package com.project.shop_online_be.Response;

import com.project.shop_online_be.Model.AttributeValue;
import com.project.shop_online_be.Model.Product;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AttributeResponse {
    private Long id;
    private String label;
    private Set<AttributeValue> options;
}
