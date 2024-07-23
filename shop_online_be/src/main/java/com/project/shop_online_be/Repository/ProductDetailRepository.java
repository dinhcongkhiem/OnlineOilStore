package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.Product;
import com.project.shop_online_be.Model.ProductDetail;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {

    @Query("SELECT MAX(p.price) as maxPrice, MIN(p.price) as minPrice FROM ProductDetail p")
    Tuple findMaxAndMinPrice();
    @Query("SELECT DISTINCT p.weight FROM ProductDetail p")
    List<Float> findListWeight();
}
