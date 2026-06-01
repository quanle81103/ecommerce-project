package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.AuthDto;
import com.ecommerce.ecommerce.response.AuthResponse;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/login")
    public ResponseObject<AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthResponse response = authService.login(request);
        return new ResponseObject<>(HttpStatus.OK, "Success", response);
    }
}
