package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.util.MessageType;
import lombok.Data;

import java.time.LocalDateTime;

public abstract class MessageDto {
    @Data
    public static class MessageResponse {
        private Long id;
        private Long conversationId;
        // or sender ID
        private Long userId;
        private String content;
        private MessageType messageType;
        private boolean read;
        private LocalDateTime createdAt;
    }

    @Data
    public static class MessageChatReponse {
        private Long id;
        private Long conversationId;
        private Long userId;
        private String content;
        private LocalDateTime createdAt;
    }

    @Data
    public static class MessageRequest {
        private String content;
    }
}
