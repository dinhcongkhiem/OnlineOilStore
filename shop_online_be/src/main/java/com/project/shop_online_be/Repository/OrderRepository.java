package com.project.shop_online_be.Repository;

import com.project.shop_online_be.Model.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    Page<Orders> findByStatusIn (List<Integer> statusFilter, Pageable pageable);

    Page<Orders> findByStatusInAndCreateDateBetween(
            List<Integer> statusFilter,
            Date startDate,
            Date endDate,
            Pageable pageable
    );
}
