package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dao.Image;
import com.ecommerce.ecommerce.dto.ImageDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.ImageServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/images")
@RequiredArgsConstructor
public class ImageController {
    private final ImageServiceImpl imageService;

    @GetMapping("/image/{imageId}")
    public ResponseObject<ImageDto.ImageResponse> getImage(@PathVariable Long imageId) {
        return new ResponseObject<>(HttpStatus.OK, "Success", imageService.getImage(imageId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @DeleteMapping("/image/delete/{imageId}")
    public ResponseObject<Void> deleteImageWithId(@PathVariable Long imageId) {
        imageService.deleteImageWithId(imageId);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @DeleteMapping("/image/{productId}/delete")
    public ResponseObject<Void> deleteAllImageOfaProduct(@PathVariable Long productId) {
        imageService.deleteAllImageOfaProduct(productId);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PostMapping("/image/{productId}/upload")
    public ResponseObject<ImageDto.ImageResponse> uploadImage(@RequestParam("file") MultipartFile multipartFile, @PathVariable Long productId) throws IOException {
//        System.out.println("file name: " + multipartFile.getOriginalFilename());
        return new ResponseObject<>(HttpStatus.OK, "Success", imageService.uploadImage(multipartFile, productId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PostMapping("/image/{productId}/upload/images")
    public ResponseObject<List<ImageDto.ImageResponse>> uploadlistOfImage(@RequestParam("file") List<MultipartFile> multipartFiles, @PathVariable Long productId) throws IOException {
        return new ResponseObject<>(HttpStatus.OK, "Success", imageService.uploadlistOfImage(multipartFiles, productId));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PutMapping("/image/{productId}/update")
    public ResponseObject<Void> updateImage(@RequestParam("file") List<MultipartFile> multipartFiles, @PathVariable Long productId) throws IOException {
        imageService.updateImage(multipartFiles, productId);
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }
}
