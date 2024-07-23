package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttributeValueRepository extends JpaRepository<AttributeValue, Long> {
}
