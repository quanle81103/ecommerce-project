package com.ecommerce.ecommerce.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public abstract class OrderDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderResponse {
        private Long id;
        private LocalDateTime orderDate;
        private BigDecimal totalAmount;
    }

    @Getter
    @Setter
    @Builder
    public static class CreateOrderRequest {
        private LocalDateTime orderDate;
        private BigDecimal totalAmount;
    }
}
