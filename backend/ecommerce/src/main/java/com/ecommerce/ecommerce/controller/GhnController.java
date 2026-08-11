package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dao.*;
import com.ecommerce.ecommerce.dto.GhnDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.CartRepository;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.ShopRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.GhnServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/ghn")
public class GhnController {

    private final ShopRepository shopRepository;
    private final GhnServiceImpl ghnService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @GetMapping("/services")
    public ResponseObject<GhnDto.GhnAvailableServiceResponse> getServices(@RequestBody GhnDto.GhnAvailableServiceRequest request)  {
        Shop shop = shopRepository.findById((long) request.getShop_id()).orElseThrow(() -> new ResourceNotFound("Shop with id [%s] not found".formatted(request.getShop_id())));

        return new ResponseObject<>(HttpStatus.OK, "Success", ghnService.getAvailableService(shop.getGhnToken(), String.valueOf(shop.getGhnShopId()), request));
    }

    @PostMapping("/fee")
    public ResponseObject<GhnDto.ShippingFeeResponse> getShippingFee(@RequestBody GhnDto.GhnShippingFeeRequest request ) {
        Shop shop =shopRepository.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFound("Shop id [%s] not found".formatted(request.getShopId())));
        User user = userRepository.findById(AuthUtil.getCurrentUserId()).orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(AuthUtil.getCurrentUserId())));
        Cart cart = cartRepository.findIdByUser_Id(user.getId()).orElseThrow(() -> new ResourceNotFound("Cart of user id [%s], cart id [%s] not found".formatted(user.getId(), user.getCart().getId())));
        List<CartItem> cartItems = cart.getCartItems().stream().filter(item -> item.getProduct().getShop().getId().equals(request.getShopId())).toList();
        GhnDto.GhnAddressResponse.GhnShopInfo shopInfo = ghnService.getInfo(shop.getGhnToken(), String.valueOf(shop.getGhnShopId()));
        int fromDistrictId = shopInfo.getDistrictId();
        String fromWardCode = shopInfo.getWardCode();
        int totalWeight = cartItems.stream().map(item -> item.getProduct().getWeight() * item.getQuantity()).reduce(0, Integer::sum);
        int insuranceValue = cartItems.stream().map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add).intValue();
        int length = cartItems.stream().mapToInt(item -> item.getProduct().getLength()).max().orElse(50);
        int width = cartItems.stream().mapToInt(item -> item.getProduct().getWidth()).max().orElse(50);
        int height = cartItems.stream().mapToInt(item -> item.getProduct().getHeight()).max().orElse(50);
        // from to shopId
        GhnDto.GhnAvailableServiceRequest availableServiceRequest = GhnDto.GhnAvailableServiceRequest.builder()
                .shop_id(shop.getGhnShopId())
                .from_district(fromDistrictId)
                .to_district(request.getToDistrictId())
                .build();
        GhnDto.GhnAvailableServiceResponse availableServiceResponse = ghnService.getAvailableService(shop.getGhnToken(), String.valueOf(shop.getGhnShopId()), availableServiceRequest);
        GhnDto.GhnAvailableServiceResponse.ServiceData service = availableServiceResponse.getData().stream()
                .filter(s -> s.getServiceTypeId() == 2).findFirst().orElseThrow(() -> new ResourceNotFound("Unable to find service type 2"));
        String serviceName = service.getShortName();
        Integer serviceId = service.getServiceId();
        Integer serviceTypeId = service.getServiceTypeId();

        GhnDto.GhnLeadTime requestLeadtime = GhnDto.GhnLeadTime.builder()
                .fromDistrictId(fromDistrictId)
                .fromWardCode(fromWardCode)
                .toDistrictId(request.getToDistrictId())
                .toWardCode(request.getToWardCode())
                .shopId(Long.valueOf(shop.getGhnShopId()))
                .serviceId(serviceId).build();

        GhnDto.GhnLeadTimeResponse response = ghnService.getLeadTime(String.valueOf(shop.getGhnShopId()), shop.getGhnToken(), requestLeadtime);
        String expectedDelivery = response.getData().getLeadtime();
        GhnDto.GhnShippingOrderFeeRequest req = GhnDto.GhnShippingOrderFeeRequest.builder()
                .fromDistrictId(fromDistrictId)
                .fromWardCode(fromWardCode)
                .serviceTypeId(serviceTypeId)
                .insuranceValue(insuranceValue)
                .toDistrictId(request.getToDistrictId())
                .toWardCode(request.getToWardCode())
                .shopId(request.getShopId())
                .width(width)
                .weight(totalWeight)
                .height(height)
                .length(length)
                .serviceName(serviceName)
                .expectedDelivery(expectedDelivery)
                .build();

        GhnDto.GhnShippingOrderFeeResponse feeResponse = ghnService.getShippingFee(String.valueOf(shop.getGhnShopId()), shop.getGhnToken(), req);

        GhnDto.ShippingFeeResponse response1 = GhnDto.ShippingFeeResponse.builder()
                .shopId(shop.getId())
                .total(feeResponse.getData().getTotal())
                .serviceName(serviceName)
                .expectedDelivery(Long.valueOf(expectedDelivery))
                .build();
        return new ResponseObject<>(HttpStatus.OK, "Success", response1);
    }

    @PostMapping("/leadtime")
    public ResponseObject<GhnDto.GhnLeadTimeResponse> getLeadTime(@RequestBody GhnDto.GhnLeadTime request) {
        Shop shop = shopRepository.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFound("Shop id [%s] not found".formatted(request.getShopId())));
        return new ResponseObject<>(HttpStatus.OK, "Success", ghnService.getLeadTime(String.valueOf(shop.getGhnShopId()), shop.getGhnToken(), request));
    }
}
