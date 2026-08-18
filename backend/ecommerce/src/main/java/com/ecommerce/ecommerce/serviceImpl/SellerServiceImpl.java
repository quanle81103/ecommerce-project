package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dto.SellerDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.util.Mapper.MapperObjectResponse;
import com.ecommerce.ecommerce.util.status.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
@RequiredArgsConstructor
public class SellerServiceImpl {

    private final OrderRepository orderRepository;
    private final MapperObjectResponse mapperObjectResponse;

    public Page<SellerDto.OrderResponse> getOrders(Long sellerId, OrderStatus status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page,size, Sort.by("orderDate").descending());

        Page<Order> orders;

        if (keyword == null || keyword.isBlank()) {
            orders = orderRepository.findOrders(sellerId, status, pageable);
        } else {
            orders = orderRepository.searchOrders(sellerId, status, keyword.trim(), pageable);
        }

        return orders.map(mapperObjectResponse::toOrderResponse);
    }

    public SellerDto.OrderDetailResponse getOrderDetail(Long sellerId, Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFound("Order with id [%s] not found".formatted(orderId)));

        if (!order.getShop().getUser().getId().equals(sellerId)) {
            throw new AccessDeniedException("Unauthorized");
        }

        return mapperObjectResponse.toOrderDetailResponse(order);
    }

    public SellerDto.UpdateStatusResponse updateStatus(SellerDto.UpdateStatusRequest request, Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFound("Order with id [%s] not found".formatted(orderId)));

        order.setOrderStatus(request.getOrderStatus());
        orderRepository.save(order);

        return SellerDto.UpdateStatusResponse.builder()
                .status(order.getOrderStatus())
                .orderId(order.getId())
                .message("Cập nhật trạng thái đơn hàng thành công " + order.getOrderStatus())
                .build();
    }

    public SellerDto.RevenueResponse.RevenueSummaryResponse getRevenueResponse(Long sellerId) {
        BigDecimal revenue = orderRepository.getTotalRevenue(sellerId);
        Long totalOrders = orderRepository.getTotalOrders(sellerId);
        Long totalProductSolds = orderRepository.getTotalProductSolds(sellerId);
        Long totalCustomers = orderRepository.getTotalCustomers(sellerId);

        return new SellerDto.RevenueResponse.RevenueSummaryResponse(
                revenue,
                totalOrders,
                totalProductSolds,
                totalCustomers
        );
    }

    public List<SellerDto.RevenueResponse.RevenueChartResponse> getRevenueChartResponse(Long sellerId) {
        return orderRepository.getRevenueChartResponse(sellerId)
                .stream().map(item ->
                        new SellerDto.RevenueResponse.RevenueChartResponse(item.getDate(), item.getRevenue())).toList();
    }

    public List<SellerDto.RevenueResponse.TopProductResponse> getTopProductResponse(Long sellerId) {
        return orderRepository.getTopProducts(sellerId)
                .stream()
                .map(item -> new SellerDto.RevenueResponse.TopProductResponse(
                        item.getProductId(),
                        item.getProductName(),
                        item.getSold(),
                        item.getRevenue()
                ))
                .toList();
    }
}
