package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.Attribute;
import com.project.shop_online_be.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    List<Attribute> findByProduct(Product product);
}
