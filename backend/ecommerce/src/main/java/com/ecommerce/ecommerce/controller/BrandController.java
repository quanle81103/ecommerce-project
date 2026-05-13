package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dao.Brand;
import com.ecommerce.ecommerce.dto.BrandDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.BrandServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/brands")
@RequiredArgsConstructor
public class BrandController {
    private final BrandServiceImpl brandService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/brand")
    public ResponseObject<BrandDto.BrandResponse> createBrand(@Valid @RequestBody BrandDto.CreateBrandRequest request) {
        return new ResponseObject<>(HttpStatus.CREATED, "Success", brandService.createBrand(request));
    }
}
