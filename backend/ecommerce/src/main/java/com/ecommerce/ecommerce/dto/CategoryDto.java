package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Data
public abstract class CategoryDto {
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryResponse {
        private Long id;
        private String name;
        private List<ProductDto> products;
    }

    @Getter
    @Setter
    @Builder
    public static class CreateCategoryRequest {
        @NotBlank
        private String name;
    }
}
