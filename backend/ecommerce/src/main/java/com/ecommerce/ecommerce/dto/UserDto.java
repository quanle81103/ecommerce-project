package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public abstract class UserDto {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String place;
        private Long cartId;

    }

    @Builder
    @Getter
    @Setter
    public static class CreateUserRequest {
        @NotBlank
        private String firstName;

        @NotBlank
        private String lastName;

        @NotBlank
        @Email
        private String email;

        private String place;

        @NotBlank
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Getter
    @Setter
    @Builder
    public static class UpdateUser {
        private String firstName;
        private String lastName;

        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;
        private Integer wardCode;
        private String wardName;
        private String districtName;
        private Integer districtId;
        private String provinceName;
    }


}
