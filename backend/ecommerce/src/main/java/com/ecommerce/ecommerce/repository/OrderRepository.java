package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dto.SellerDto;
import com.ecommerce.ecommerce.projection.RevenueChartProjection;
import com.ecommerce.ecommerce.projection.TopProductProjection;
import com.ecommerce.ecommerce.util.status.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // find orders o with o.userid = userid;
    List<Order> findByUserId(Long userId);

    // find orders o which o.order_status = 'PENDING' and user u_id
    @Query("SELECT o FROM Order o JOIN o.user u " +
            "WHERE o.orderStatus = 'PENDING' AND u.id = :userId")
    List<Order> findPendingOrdersByUserId(@Param("userId") Long userId);

    // query khi có keyword
    @Query("""
        SELECT o
        FROM Order o
        WHERE o.shop.user.id = :sellerId
        AND (:status IS NULL OR o.orderStatus = :status)
        AND (
            :keyword IS NULL
            OR LOWER(CONCAT(o.user.firstName, ' ', o.user.lastName))
                LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR CAST(o.id AS string)
                LIKE CONCAT('%', :keyword, '%')
        )
    """)
    Page<Order> searchOrders(
            @Param("sellerId") Long sellerId,
            @Param("status") OrderStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );


    // query khi ko có keyword
    @Query("""
        SELECT o
        FROM Order o
        WHERE o.shop.user.id = :sellerId
        AND (:status IS NULL OR o.orderStatus = :status)
    """)
    Page<Order> findOrders(
            @Param("sellerId") Long sellerId,
            @Param("status") OrderStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0)
        FROM Order o
        WHERE o.shop.user.id = :sellerId
        AND o.orderStatus = com.ecommerce.ecommerce.util.status.OrderStatus.DELIVERED
    """)
    BigDecimal getTotalRevenue(@Param("sellerId") Long sellerId);

    @Query("""
        SELECT COUNT(o.id)
        FROM Order o
        WHERE o.shop.user.id = :sellerId
        AND o.orderStatus = com.ecommerce.ecommerce.util.status.OrderStatus.SHIPPING
    """)
    Long getTotalOrders(@Param("sellerId") Long sellerId);

    @Query("""
        SELECT COALESCE(SUM(oi.quantity), 0)
        FROM Order o
        JOIN o.orderitems oi
        WHERE o.shop.user.id = :sellerId
        AND o.orderStatus = com.ecommerce.ecommerce.util.status.OrderStatus.DELIVERED
    """)
    Long getTotalProductSolds(@Param("sellerId") Long sellerId);

    @Query("""
        SELECT COUNT(DISTINCT o.user.id)
        FROM Order o
        WHERE o.shop.user.id = :sellerId
        AND o.orderStatus = com.ecommerce.ecommerce.util.status.OrderStatus.DELIVERED
    """)
    Long getTotalCustomers(@Param("sellerId") Long sellerId);

    @Query("""
        SELECT
            FUNCTION('DATE', o.orderDate) AS date,
            SUM(o.totalAmount) AS revenue
        FROM Order o
        WHERE o.shop.user.id = :sellerId
        AND o.orderStatus = com.ecommerce.ecommerce.util.status.OrderStatus.DELIVERED
        GROUP BY FUNCTION('DATE', o.orderDate)
        ORDER BY FUNCTION('DATE', o.orderDate)
    """)
    List<RevenueChartProjection> getRevenueChartResponse(
            @Param("sellerId") Long sellerId
    );

    @Query("""
        SELECT
            p.id AS productId,
            p.name AS productName,
            SUM(oi.quantity) AS sold,
            SUM(oi.unitPrice * oi.quantity) AS revenue
        FROM Order o
        JOIN o.orderitems oi
        JOIN oi.product p
        WHERE o.shop.user.id = :sellerId
        AND o.orderStatus = com.ecommerce.ecommerce.util.status.OrderStatus.DELIVERED
        GROUP BY p.id, p.name
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<TopProductProjection> getTopProducts(
            @Param("sellerId") Long sellerId
    );
}
