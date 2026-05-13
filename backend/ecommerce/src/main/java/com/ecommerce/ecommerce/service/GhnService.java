package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dto.GhnDto;

import java.util.List;

public interface GhnService {

    GhnDto.GhnOrderResponse createOrder(String token, String shopId, GhnDto.GhnCreateOrderRequest request);

    boolean verifyGhnCredentials(String ghnToken, String shopId);

    GhnDto.GhnAddressResponse.GhnShopInfo getInfo(String ghnToken, String ghnShopId);

    String getDistrictName(String token, String ghnShopId);

    String getWardName(String token, String ghnShopId);

    String getProvinceName(String token, String ghnShopId);

    GhnDto.GhnCancelOrderResponse cancelOrder(String ghnToken, String ghnShopId, GhnDto.GhnCancelOrderRequest request);

    GhnDto.GhnCancelOrderResponse cancelOrderForShop(Long shopId, Long userId, GhnDto.GhnCancelOrderRequest request);
}
