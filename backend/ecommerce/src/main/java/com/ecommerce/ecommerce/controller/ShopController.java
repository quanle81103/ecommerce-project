package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dto.GhnDto;
import com.ecommerce.ecommerce.dto.ShopDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.ShopRepository;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.GhnServiceImpl;
import com.ecommerce.ecommerce.serviceImpl.ShopServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/shops")
public class ShopController {

    private final ShopServiceImpl shopService;

    @PostMapping(value = "/shop", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseObject<ShopDto.ShopResponse> createShop(@Valid @RequestPart("shop") ShopDto.CreateShopRequest request, @RequestPart("logo") MultipartFile file) throws IOException {
        return new ResponseObject<>(HttpStatus.OK, "Success", shopService.createShop(request, file));
    }

    @PreAuthorize("hasRole('ROLE_SHOP_OWNER')")
    @PostMapping("/shop/{shopId}/ghn-connect")
    public ResponseObject<?> connectGhn(@PathVariable Long shopId, @Valid @RequestBody GhnDto.GhnConnectRequest request) {
        shopService.connectGhn(shopId, AuthUtil.getCurrentUserId(),
                request.getGhnToken(), Integer.valueOf(request.getGhnShopId()));
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }

    @GetMapping
    public ResponseObject<Page<ShopDto.ShopResponse>> getAll(@PageableDefault(size = 10) Pageable pageable) {
        return new ResponseObject<>(HttpStatus.OK, "Success", shopService.getAll(pageable));
    }

    @GetMapping("/shop/{productId}")
    public ResponseObject<ShopDto.ShopInfoResponse> getShopByProduct(@PathVariable Long productId) {
        return new ResponseObject<>(HttpStatus.OK, "Success", shopService.getShopInfo(productId));
    }

    @GetMapping("/shop/my")
    public ResponseObject<ShopDto.ShopResponse> getMyShop() {
        return new ResponseObject<>(HttpStatus.OK, "Success", shopService.getByUser());
    }
}
