package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.CartItemServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/cartitems")
@RequiredArgsConstructor
public class CartItemController {
    private final CartItemServiceImpl cartItemService;

    @PostMapping("/add")
    public ResponseObject<Void> addItemToCart(@RequestParam Long productId, @RequestParam int quantity) {
        cartItemService.addItemToCart(AuthUtil.getCurrentUserId(), productId, quantity);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }

    @DeleteMapping("/remove")
    public ResponseObject<Void> removeItemFromCart(@RequestParam Long productId) {
        cartItemService.removeItemFromCart(AuthUtil.getCurrentUserId(), productId);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }

    @PutMapping("/update")
    public ResponseObject<Void> updateItemQuantity(@RequestParam Long productId, @RequestParam int quantity) {
        cartItemService.updateItemQuantity(AuthUtil.getCurrentUserId(), productId, quantity);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }
}
