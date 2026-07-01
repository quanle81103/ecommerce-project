package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dao.Image;
import com.ecommerce.ecommerce.dto.ImageDto;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageService {

    ImageDto.ImageResponse getImage(Long id);

    void deleteImageWithId(Long imageId);

    // delete all images of a product
    void deleteAllImageOfaProduct(Long productId);

    ImageDto.ImageResponse uploadImage(MultipartFile file, Long productId) throws IOException;

    // Upload ảnh mới → Xóa ảnh cũ trên S3 → Update URL trong DB
    @Transactional
    void updateImage(List<MultipartFile> files, Long productId) throws IOException;

    List<ImageDto.ImageResponse> uploadlistOfImage(List<MultipartFile> files, Long productId) throws IOException;
}
