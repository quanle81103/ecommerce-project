package com.ecommerce.ecommerce.dto;

import lombok.*;

public abstract class ImageDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImageResponse {
        private Long id;
        private String imageKey;
        private Long productId;
    }
}
