package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.CartDto;

import java.math.BigDecimal;

public interface CartService {
    CartDto.CartResponse getCartByUserId(Long userId);
    BigDecimal getTotalPrice(Long userId);
}
