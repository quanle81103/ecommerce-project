package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.util.status.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public abstract class SellerDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    // for seller only
    public static class OrderResponse {
        private Long id;
        private String customerName;
        private String customerPhone;
        private LocalDateTime createdAt;
        private BigDecimal subtotal;
        private Integer shippingFee;
        private BigDecimal total;
        private OrderStatus status;
    }

    @Builder
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDetailResponse {

        // ===== Order =====
        private Long id;
        private LocalDateTime createdAt;
        private OrderStatus status;

        // ===== Customer =====
        private String customerName;
        private String customerPhone;
        private String customerAddress;

        // ===== Payment =====
        private BigDecimal subtotal;
        private Integer shippingFee;
        private BigDecimal total;

        // ===== Shipping =====
        private String shippingCode;
        private LocalDateTime expectedDelivery;

        // ===== Products =====
        private List<OrderItemResponse> items;

        @Builder
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class OrderItemResponse {
            private Long productId;
            private String productName;
            private String image;
            private Integer quantity;
            private BigDecimal unitPrice;
            private Integer weight;
        }
    }

    @Builder
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class UpdateStatusRequest {
        private OrderStatus orderStatus;
    }

    @Builder
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusResponse {
        private Long orderId;
        private OrderStatus status;
        private String message;
    }

    @Builder
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueResponse {
        private RevenueSummaryResponse summary;
        private List<RevenueChartResponse> chart;
        private List<TopProductResponse> topProducts;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class RevenueSummaryResponse {
            private BigDecimal revenue;
            private Long totalOrders;
            private Long totalProductSolds;
            private Long totalCustomers;
        }

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class RevenueChartResponse {
            private LocalDate date;
            private BigDecimal revenue;
        }

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class TopProductResponse {
            private Long productId;
            private String productName;
            private Long sold;
            private BigDecimal revenue;
        }
    }
}
