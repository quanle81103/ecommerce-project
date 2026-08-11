package com.ecommerce.ecommerce.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public abstract class PaymentDto {
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Data
    public static class VnPayResponse {
        public String code;
        public String message;
        public String paymentUrl;
    }

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class PaymentResponse {
        private Long id;
        private List<OrderDto.OrderResponse> orders;
        private BigDecimal totalAmount;
        private String responseCode;
        private LocalDateTime createAt;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentStatusResponse {
        private String txnRef;
        private String status;
        private Long paymentId;
    }
}
