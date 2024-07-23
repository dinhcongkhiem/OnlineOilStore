package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.ImageProduct;
import com.project.shop_online_be.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ImageProductRepository extends JpaRepository<ImageProduct, Long> {
    @Query(value = "select * from image_product i where i.product_id = :productid LIMIT 1",nativeQuery = true)
    Optional<ImageProduct> findByProduct(Long productid);
}
