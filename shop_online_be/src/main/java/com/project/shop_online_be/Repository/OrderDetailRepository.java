package com.project.shop_online_be.Repository;


import com.project.shop_online_be.Model.Orders;
import com.project.shop_online_be.Model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrder(Orders order);

}
