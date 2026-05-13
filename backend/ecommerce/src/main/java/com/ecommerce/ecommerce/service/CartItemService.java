package com.ecommerce.ecommerce.service;

public interface CartItemService {
    void addItemToCart(Long userId, Long productId, int quantity);
    void removeItemFromCart(Long userId, Long productId);
    void updateItemQuantity(Long userId, Long productId, int quantity);
}
