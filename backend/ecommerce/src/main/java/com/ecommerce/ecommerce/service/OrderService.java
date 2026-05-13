package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dao.CartItem;
import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dto.OrderDto;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public interface OrderService {
    List<OrderDto.OrderResponse> createOrderFromCart(Long userId);

    BigDecimal getTotalAmountOfEachShop(Shop shop, List<CartItem> items);

    OrderDto.OrderResponse getOrderById(Long orderId, Long userId);

    List<OrderDto.OrderResponse> getOrdersByUser(Long userId);

    @Transactional
    void cancelOrder(Long orderId, Long userId);
}
