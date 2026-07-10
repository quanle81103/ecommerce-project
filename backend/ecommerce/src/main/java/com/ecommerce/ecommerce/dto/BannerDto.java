package com.ecommerce.ecommerce.dto;

import lombok.Data;

import java.time.LocalDateTime;

public abstract class BannerDto {
    @Data
    public static class BannerResponse {
        private Long id;
        private Long imageId;
        private Boolean active;
        private Integer displayOrder;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String bannerUrl;
    }
}
