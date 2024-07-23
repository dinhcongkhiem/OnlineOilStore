package com.project.shop_online_be.Embeddable;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Color {
    private String nameColor;
    private String colorCode;
}
