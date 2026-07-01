package com.ecommerce.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;

public abstract class CartDto {
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartResponse {
        private Long id;
        private BigDecimal totalAmount;
        private Long userId;
        private List<CartItemDto.CartItemResponse> cartItems;
    }

}
