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
        private String receiverName;
        private String phone;
        private String place;
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
        private Integer provinceId;
        private Integer districtId;
        private String wardCode;
        private String receiverName;
        private String phone;
        private String place;
        private List<ShippingFeeRequest> shippingFees;

        @Data
        public static class ShippingFeeRequest {
            private Long shopId;
            private Integer shippingFee;
        }
    }
}
