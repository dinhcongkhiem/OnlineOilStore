package com.project.shop_online_be.Repository.Specification;

import com.project.shop_online_be.Model.Product;
import com.project.shop_online_be.Model.ProductDetail;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

public class ProductSpecification {
    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> cb.like(cb.upper(root.get("name")), "%" + keyword.toUpperCase() + "%");
    }

    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            Join<Product, ProductDetail> productDetailJoin = root.join("productDetails");
            return cb.between(productDetailJoin.get("price"), minPrice, maxPrice);
        };
    }

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> hasWeight(List<Float> weights) {
        return (root, query, cb) -> {
            Join<Product, ProductDetail> productDetailJoin = root.join("productDetails");
            return productDetailJoin.get("weight").in(weights);
        };
    }

}
