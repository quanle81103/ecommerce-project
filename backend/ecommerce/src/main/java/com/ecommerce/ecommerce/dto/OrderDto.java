package com.ecommerce.ecommerce.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public abstract class OrderDto {
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderResponse {
        private List<Response> orders;
//        private LocalDateTime orderDate;
        private BigDecimal totalAmount;
        private String txnRef;

        @Data
        @Builder
        public static class  Response {
            private Long id;
            private BigDecimal totalAmount;
        }
    }

    @Getter
    @Setter
    @Builder
    public static class CreateOrderRequest {
//        private LocalDateTime orderDate;
//        private BigDecimal totalAmount;

        private Integer provinceId;
        private Integer districtId;
        private String wardCode;
    }
}
