package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Image;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dto.ImageDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.ImageRepository;
import com.ecommerce.ecommerce.service.ImageService;
import com.ecommerce.ecommerce.util.Mapper.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final ProductServiceImpl productServiceImpl;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private String buildImageUrl(String key) {
        return "https://" + bucketName + "s3.amazonaws.com/" + key;
    }

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
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(image.getImageKey())
                .build();

        s3Client.deleteObject(request);

        imageRepository.deleteById(imageId);
    }
    // delete all images of a product
    @Override
    public void deleteAllImageOfaProduct(Long productId) {
        Product product = MapperUtil.mapObject(productServiceImpl.getProductById(productId), Product.class);

        List<Image> images = new ArrayList<>(product.getImage());
        for (Image image : images) {
            deleteImageWithId(image.getId());
        }
    }

    @Override
    public ImageDto.ImageResponse uploadImage(MultipartFile file, Long productId) throws IOException {
        // For example original = "my-photo.png"
        String original = file.getOriginalFilename();

        assert original != null;
        String extension = original.substring(original.lastIndexOf("."));

        String path = "products/" + productId + "/" + UUID.randomUUID() + extension;
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(path)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        Image image = new Image();
        image.setProduct(MapperUtil.mapObject(productServiceImpl.getProductById(productId), Product.class));
        image.setImageKey(buildImageUrl(path));

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
