package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.*;
import com.ecommerce.ecommerce.dto.GhnDto;
import com.ecommerce.ecommerce.exception.BusinessException;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.PaymentRepository;
import com.ecommerce.ecommerce.repository.ShippingOrderRepository;
import com.ecommerce.ecommerce.service.GhnService;
import com.ecommerce.ecommerce.util.status.OrderStatus;
import com.ecommerce.ecommerce.util.status.ShippingStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShippingOrderServiceImpl {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ShippingOrderRepository shippingOrderRepository;
    private final GhnService ghnService;

    private GhnDto.GhnCreateOrderRequest buildGhnRequest(Order order) {
        List<GhnOrderItem> ghnOrderItems = order.getOrderitems()
                .stream()
                .map(item -> GhnOrderItem.builder()
                        .name(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getUnitPrice().intValue())
                        .weight(item.getWeight())
                        .code(String.valueOf(item.getProduct().getId()))
                        .build()).toList();
        Shop shop = order.getShop();
        User user = order.getUser();
        String name = user.getFirstName() + user.getLastName();
//        log.info("ToName: {} ToPhone: {} RequiredNote: {}", name, user.getPhone(), "KHONGCHOXEMHANG");
        return GhnDto.GhnCreateOrderRequest.builder()
                .fromName(shop.getFromName())
                .fromPhone(shop.getFromPhone())
                .fromAddress(shop.getFromAddress())
                .fromWardName(shop.getFromWardName())
                .fromDistrictName(shop.getFromDistrictName())
                .fromProvinceName(shop.getFromProvinceName())
                .paymentTypeId(1)
                .serviceTypeId(2)
                .requiredNote("KHONGCHOXEMHANG")
                .toName(name)
                .toPhone(user.getPhone())
                .toAddress(user.getPlace() != null ? user.getPlace() : "N/A")
                .toWardCode(order.getWardCode())
                .toDistrictId(order.getDistrictId())
                .weight(20).height(20).length(20).width(20)
                .items(ghnOrderItems)
                .build();

    }

    public ShippingOrder createShippingOrder(Order order) {
        Shop shop = order.getShop();
        GhnDto.GhnCreateOrderRequest req = buildGhnRequest(order);
        GhnDto.GhnOrderResponse response = ghnService.createOrder(shop.getGhnToken(),String.valueOf(shop.getGhnShopId()),req);
        LocalDateTime time = Instant.parse(response.getData().getExpectedDeliveryTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
        ShippingOrder shippingOrder = ShippingOrder.builder()
                        .ghnOrderCode(response.getData().getOrderCode())
                        .shippingFee(response.getData().getTotalFee())
                        .expectedDeliveryTime(time)
                        .createdAt(LocalDateTime.now())
                        .status(ShippingStatus.CREATED)
                        .order(order)
                        .build();

        return shippingOrderRepository.save(shippingOrder);
    }

    @Transactional
    public void handover(Long sellerId, Long orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFound("Order with id [%s] not found".formatted(orderId)));

        if(!order.getShop().getUser().getId().equals(sellerId)){
            throw new AccessDeniedException("Unauthorized");
        }

        if(order.getOrderStatus()!=OrderStatus.PAID){
            throw new BusinessException(HttpStatus.CONFLICT, "Only PAID orders can be handover");
        }

        ShippingOrder shippingOrder = createShippingOrder(order);
        order.setShippingOrder(shippingOrder);
        order.setOrderStatus(OrderStatus.SHIPPING);
        orderRepository.save(order);
    }
}
