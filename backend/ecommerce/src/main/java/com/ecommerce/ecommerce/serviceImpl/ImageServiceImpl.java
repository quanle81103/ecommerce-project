package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Image;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dto.ImageDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.ImageRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.service.ImageService;
import com.ecommerce.ecommerce.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final ProductServiceImpl productServiceImpl;
    private final S3ServiceImpl s3Service;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private String buildImageUrl(String key) {
        return "https://" + bucketName + "s3.amazonaws.com/" + key;
    }

//    @Override
//    public List<String> getImageUrl(Long productId) {
//        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFound("Product with id [%s] not found".formatted(productId)));
//        List<String> urls = new ArrayList<>();
//        for (Image image : product.getImage()) {
//            String imageUrl = buildImageUrl(image.getImageKey());
//            urls.add(imageUrl);
//        }
//        return urls;
//    }

    public Image getImageById(Long id) {
        return imageRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Image with id [%s] not found".formatted(id)));
    }

    @Override
    public ImageDto.ImageResponse getImage(Long id) {
        return MapperUtil.mapObject(getImageById(id), ImageDto.ImageResponse.class);
    }

    @Override
    public void deleteImageWithId(Long imageId) {
        Image image = getImageById(imageId);

        // delete image in both places, db and cloud respectively
        s3Service.deleteFile(image.getImageKey());
        imageRepository.deleteById(imageId);
    }
    // delete all images of a product
    @Override
    public void deleteAllImageOfaProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFound("Product with id [%s] not found".formatted(productId)));
        for (Image image : product.getImage()) {
            deleteImageWithId(image.getId());
        }
    }

    @Override
    public ImageDto.ImageResponse uploadImage(MultipartFile file, Long productId) throws IOException {
        // For example original = "my-photo.png"
        String folderPath = "products/" + productId;
        String key = s3Service.uploadFile(file, folderPath);

        Image image = new Image();
        image.setProduct(MapperUtil.mapObject(productServiceImpl.getProductById(productId), Product.class));
        image.setImageKey(key);

        return MapperUtil.mapObject(imageRepository.save(image), ImageDto.ImageResponse.class);
    }

    // Upload ảnh mới → Xóa ảnh cũ trên S3 → Update URL trong DB
    @Transactional
    @Override
    public void updateImage(List<MultipartFile> files, Long productId) throws IOException {
        List<Image> images = imageRepository.findByProductId(productId);

        uploadlistOfImage(files, productId);
        for (Image img : images) {
            deleteImageWithId(img.getId());
        }
    }

    @Override
    public List<ImageDto.ImageResponse> uploadlistOfImage(List<MultipartFile> files, Long productId) throws IOException {
        List<ImageDto.ImageResponse> urls = new ArrayList<>();

        for(MultipartFile file : files) {
            ImageDto.ImageResponse url = uploadImage(file, productId);
            urls.add(url);
        }

        return urls;
    }
}
