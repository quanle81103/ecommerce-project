package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;


public abstract class ShopDto {
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShopResponse {
        private Long id;
        private String name;
        private String description;
        private String logoUrl;
        private Long userId;
    }

    @Getter
    @Setter
    @Builder
    public static  class CreateShopRequest {
        @NotBlank
        private String name;

        private String description;
        private String logoUrl;

        @NotNull
        private Long userId;
    }

}
