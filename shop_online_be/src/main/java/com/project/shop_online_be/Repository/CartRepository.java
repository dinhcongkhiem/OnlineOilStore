package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);


    Optional<Cart> findByUserAndProductDetail( User user, ProductDetail productDetail);

}
