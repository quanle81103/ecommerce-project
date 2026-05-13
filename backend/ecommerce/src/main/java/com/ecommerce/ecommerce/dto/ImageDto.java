package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.dao.Product;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

public abstract class ImageDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImageResponse {
        private Long id;
        private String imageKey;
        private Product product;
    }
}
