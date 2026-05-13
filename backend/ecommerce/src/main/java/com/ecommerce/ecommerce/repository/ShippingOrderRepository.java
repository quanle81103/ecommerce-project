package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.ShippingOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShippingOrderRepository extends JpaRepository<ShippingOrder, Long> {
    ShippingOrder findByGhnOrderCode(String orderCode);
}
