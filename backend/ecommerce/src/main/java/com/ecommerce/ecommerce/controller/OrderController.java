package com.ecommerce.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommerce.dto.OrderDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.OrderServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderServiceImpl orderService;

    @PostMapping("/create")
    public ResponseObject<List<OrderDto.OrderResponse>> createOrderFromCart() {
        return new ResponseObject<>(HttpStatus.CREATED, "Success",
                orderService.createOrderFromCart(AuthUtil.getCurrentUserId()));
    }

    @GetMapping("/order/{orderId}")
    public ResponseObject<OrderDto.OrderResponse> getOrderById(@PathVariable Long orderId) {
        return new ResponseObject<>(HttpStatus.OK, "Success",
                orderService.getOrderById(orderId, AuthUtil.getCurrentUserId()));
    }

    @GetMapping("/me")
    public ResponseObject<List<OrderDto.OrderResponse>> getOrdersByCurrentUser() {
        return new ResponseObject<>(HttpStatus.OK, "Success",
                orderService.getOrdersByUser(AuthUtil.getCurrentUserId()));
    }

    @PutMapping("/order/{orderId}/cancel")
    public ResponseObject<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId, AuthUtil.getCurrentUserId());
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }
}
