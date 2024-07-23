package com.project.shop_online_be.Repository;


import com.project.shop_online_be.Model.Delivery;
import com.project.shop_online_be.Model.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Page<Delivery> findByStatusIn(List<Integer> statusFilter, Pageable pageable);

    Optional<Delivery> findByOrdersAndStatusNot(Orders orders, Integer status); //check created delivery

    Page<Delivery> findByStatusInAndCreateDateBetween(
            List<Integer> statusFilter,
            Date startDate,
            Date endDate,
            Pageable pageable);

    Optional<Delivery> findByDeliveryAlias(String deliveryAlias);


}