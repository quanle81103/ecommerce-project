package com.ecommerce.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public abstract class ConversationDto {
    @Data
    public static class ConversationRequest {
        private Long shopId;
    }

    @Data
    public static class ConversationResponse {
        private Long id;
        private Long shopId;
        private String shopName;
        private String lastMessage;
        private LocalDateTime lastMessageAt;
        private Integer unreadCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SellerConversationResponse {
        private Long id;
        private Long buyerId;
        private String buyerName;
        private String lastMessage;
        private LocalDateTime lastMessageAt;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BuyerConversationResponse {
        private Long id;
        private Long shopId;
        private String shopName;
        private String lastMessage;
        private LocalDateTime lastMessageAt;
    }
}
