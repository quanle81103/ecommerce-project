package com.ecommerce.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


public abstract class CartItemDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private int quantity;
        private BigDecimal unitPrice;
        private Long productId;
        private String productName;
        private String productUrl;
    }
}
