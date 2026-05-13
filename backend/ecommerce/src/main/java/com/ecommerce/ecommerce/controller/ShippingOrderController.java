package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.GhnDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.GhnServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/shipping-orders")
@RequiredArgsConstructor
public class ShippingOrderController {
    private final GhnServiceImpl ghnService;

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PostMapping("/shop/{shopId}/cancel")
    public ResponseObject<GhnDto.GhnCancelOrderResponse> cancelOrder(
            @PathVariable Long shopId,
            @Valid @RequestBody GhnDto.GhnCancelOrderRequest request) {
        GhnDto.GhnCancelOrderResponse response = ghnService.cancelOrderForShop(shopId, AuthUtil.getCurrentUserId(), request);
        return new ResponseObject<>(HttpStatus.OK, "Success", response);
    }
}
