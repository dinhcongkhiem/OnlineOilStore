package com.project.shop_online_be.Service;

import com.project.shop_online_be.Embeddable.Color;
import com.project.shop_online_be.Model.ProductDetail;
import com.project.shop_online_be.Repository.ProductDetailRepository;
import com.project.shop_online_be.Response.ProductDetailResponse;
import com.project.shop_online_be.Response.ValueForFilterResponse;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductDetailService {
    private final ProductDetailRepository productDetailRepository;

    public ValueForFilterResponse findValueForFilter() {
        Tuple rangePrice = productDetailRepository.findMaxAndMinPrice();
        return ValueForFilterResponse
                .builder()
                .maxPrice((BigDecimal) rangePrice.get(0))
                .minPrice((BigDecimal) rangePrice.get(1))
                .listSize(productDetailRepository.findListWeight())
                .build();
    }

    public ProductDetailResponse convertToResponse(ProductDetail productDetail) {
        Color color;
        if(productDetail.getColor().getColorCode().isEmpty()) {
            color = null;
        }else {
            color = productDetail.getColor();
        }
        return ProductDetailResponse
                .builder()
                .id(productDetail.getId())
                .price(productDetail.getPrice())
                .weight(productDetail.getWeight())
                .color(color)
                .images(productDetail.getImages())
                .build();
    }

    public ProductDetail findById(Long id) {
        return productDetailRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }
}

