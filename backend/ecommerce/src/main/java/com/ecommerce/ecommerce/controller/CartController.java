package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.CartDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.CartServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartServiceImpl cartService;

    @GetMapping("/me")
    public ResponseObject<CartDto.CartResponse> getCart() {
        return new ResponseObject<>(HttpStatus.OK, "Success", cartService.getCartByUserId(AuthUtil.getCurrentUserId()));
    }
}
