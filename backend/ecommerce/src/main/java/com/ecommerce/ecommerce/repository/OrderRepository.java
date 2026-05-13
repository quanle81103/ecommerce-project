package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // find orders o with o.userid = userid;
    List<Order> findByUserId(Long userId);

    // find orders o which o.order_status = 'PENDING' and user u_id
    @Query("SELECT o FROM Order o JOIN o.user u " +
            "WHERE o.orderStatus = 'PENDING' AND u.id = :userId")
    List<Order> findPendingOrdersByUserId(@Param("userId") Long userId);
}
