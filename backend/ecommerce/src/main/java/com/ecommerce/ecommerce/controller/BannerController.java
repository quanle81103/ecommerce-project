package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.BannerDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.BannerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/banners")
public class BannerController {
    private final BannerServiceImpl bannerService;

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseObject<List<BannerDto.BannerResponse>> uploadBanners(@RequestParam("file")List<MultipartFile> files) {
        return new ResponseObject<>(HttpStatus.OK, "Success", bannerService.uploadBanners(files));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/visualize")
    public ResponseObject<List<BannerDto.BannerResponse>> findAllActiveBannerBetweenTime() {
        return new ResponseObject<>(HttpStatus.OK, "Success", bannerService.findAllActiveBannerBetweenTime());
    }

}
