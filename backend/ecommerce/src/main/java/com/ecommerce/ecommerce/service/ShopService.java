package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dao.CartItem;
import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dto.ShopDto;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ShopService {
    ShopDto.ShopResponse createShop(ShopDto.CreateShopRequest request, MultipartFile file) throws IOException;
    ShopDto.ShopResponse getShopById(Long shopId);
    List<ShopDto.ShopResponse> getAllShops();
    //Shop updateShop(Long shopId, UpdateShopRequest request);
    void deleteShop(Long shopId);

    @Transactional
    void connectGhn(Long shopId, Long userId, String ghnToken, Integer ghnShopId);
}
