package com.ecommerce.ecommerce.dto;

import lombok.*;

public abstract class ImageDto {
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImageResponse {
        private Long id;
        private String imageUrl;
        private Long productId;
    }
}
