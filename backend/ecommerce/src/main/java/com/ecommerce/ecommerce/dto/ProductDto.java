package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.dao.Brand;
import com.ecommerce.ecommerce.dao.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

public abstract class ProductDto {
    @Builder
    @Getter
    @Setter
    public static class CreateRequest {
        @NotBlank
        private String name;

        @NotNull
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        private BigDecimal price;

        @Min(value = 0, message = "Inventory must be >= 0")
        private int inventory;

        private String description;

        @NotNull
        private Long brandId;

        @NotNull
        private Long shopId;

        @NotNull
        private Long categoryId;

        private String brandName;
        private String categoryName;

        @Min(value = 1, message = "Weight must be >= 1")
        private int weight;

        @Min(value = 1, message = "Length must be >= 1")
        private int length;

        @Min(value = 1, message = "Height must be >= 1")
        private int height;

        @Min(value = 1, message = "Width must be >= 1")
        private int width;
    }

    @Builder
    @Getter
    @Setter
    public static class UpdateRequest {
        private Long id;
        private String name;

        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        private BigDecimal price;

        @Min(value = 0, message = "Inventory must be >= 0")
        private int inventory;

        private String description;
        private Brand brand;
        private Category category;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductResponse {
        private Long id;
        private String name;
        private BigDecimal price;
        private int inventory;
        private String description;
        private Brand brand;
        private Category category;
        private List<ImageDto> image;
    }
}
