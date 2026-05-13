package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

public abstract class BrandDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BrandResponse {
        private Long id;
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @Builder
    public static class CreateBrandRequest {
        @NotBlank
        private String name;

        private String description;
    }
}
