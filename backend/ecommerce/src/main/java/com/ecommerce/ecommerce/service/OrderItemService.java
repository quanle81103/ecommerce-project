package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dao.CartItem;
import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dao.OrderItem;

public interface OrderItemService {
    OrderItem createOrderItem(Order order, CartItem cartItems);
}
