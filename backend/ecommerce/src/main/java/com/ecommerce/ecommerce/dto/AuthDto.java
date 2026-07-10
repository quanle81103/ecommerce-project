package com.ecommerce.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

public abstract class AuthDto {
    @Getter
    @Setter
    @Data
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Getter
    @Setter
    @Data
    public static class ForgetPasswordRequest {
        @NotBlank
        @Email
        private String email;
    }

    @Getter
    @Setter
    @Data
    public static class ResetPasswordRequest {
        @NotNull
        private String rawToken;

        @NotBlank
        private String password;
    }
}
