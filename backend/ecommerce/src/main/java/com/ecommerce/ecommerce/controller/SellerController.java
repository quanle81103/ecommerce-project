package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.SellerDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.OrderServiceImpl;
import com.ecommerce.ecommerce.serviceImpl.SellerServiceImpl;
import com.ecommerce.ecommerce.serviceImpl.ShippingOrderServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import com.ecommerce.ecommerce.util.status.OrderStatus;
import jakarta.ws.rs.POST;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/seller")
public class SellerController {
    private final SellerServiceImpl sellerService;
    private final ShippingOrderServiceImpl shippingOrderService;

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @GetMapping("/orders")
    public ResponseObject<Page<SellerDto.OrderResponse>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false)OrderStatus status,
            @RequestParam(required = false)String keyword
    ) {
        return new ResponseObject<>(HttpStatus.OK, "Success",
                sellerService.getOrders(AuthUtil.getCurrentUserId(), status, keyword, page, size));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @GetMapping("/orders/{orderId}")
    public ResponseObject<SellerDto.OrderDetailResponse> getOrderDetail(@PathVariable Long orderId) {
        return new ResponseObject<>(HttpStatus.OK, "Success", sellerService.getOrderDetail(AuthUtil.getCurrentUserId(), orderId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PatchMapping("/orders/{orderId}/status")
    public ResponseObject<SellerDto.UpdateStatusResponse> updateStatus(@PathVariable Long orderId, @RequestBody SellerDto.UpdateStatusRequest request) {
        return new ResponseObject<>(HttpStatus.OK, "Success", sellerService.updateStatus(request, orderId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @GetMapping("/revenue/chart")
    public ResponseObject<List<SellerDto.RevenueResponse.RevenueChartResponse>> getRevenueChartResponse() {
        Long sellerId = AuthUtil.getCurrentUserId();
        return new ResponseObject<>(HttpStatus.OK, "Success", sellerService.getRevenueChartResponse(sellerId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @GetMapping("/revenue/best-seller")
    public ResponseObject<List<SellerDto.RevenueResponse.TopProductResponse>> getTopProductResponse() {
        Long sellerId = AuthUtil.getCurrentUserId();
        return  new ResponseObject<>(HttpStatus.OK, "Success", sellerService.getTopProductResponse(sellerId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @GetMapping("/revenue")
    public ResponseObject<SellerDto.RevenueResponse.RevenueSummaryResponse> getRevenueResponse() {
        Long sellerId = AuthUtil.getCurrentUserId();
        return new ResponseObject<>(HttpStatus.OK, "Success", sellerService.getRevenueResponse(sellerId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PostMapping("/orders/{orderId}/handover")
    public ResponseObject<Void> handover(@PathVariable Long orderId) {
        Long sellerId = AuthUtil.getCurrentUserId();
        shippingOrderService.handover(sellerId, orderId);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }
}
