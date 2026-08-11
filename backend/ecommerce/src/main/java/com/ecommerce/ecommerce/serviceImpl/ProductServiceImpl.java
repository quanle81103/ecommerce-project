package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.*;
import com.ecommerce.ecommerce.dto.ImageDto;
import com.ecommerce.ecommerce.dto.ProductDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.exception.ResourceAlreadyExist;
import com.ecommerce.ecommerce.repository.*;
import com.ecommerce.ecommerce.service.ProductService;
import com.ecommerce.ecommerce.util.AuthUtil;
import com.ecommerce.ecommerce.util.Mapper.ProductMapper;
import com.ecommerce.ecommerce.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ShopRepository shopRepository;
    private final BrandRepository brandRepository;
    private final S3ServiceImpl s3Service;
    private final ImageRepository imageRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductDto.ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Product with id [%s] not found".formatted(id)));

        return productMapper.toResponse(product);
    }

    public Product createProduct(ProductDto.CreateRequest request, Brand brand, Category category, Shop shop, List<MultipartFile> files) {
        Product product = productRepository.findByName(request.getName());
        if (product != null) {
            throw new ResourceAlreadyExist("Product with name [%s] already exist".formatted(request.getName()));
        } else {
            product = new Product();
            product.setBrand(brand);
            product.setCategory(category);
            product.setDescription(request.getDescription());
            product.setName(request.getName());
            product.setPrice(request.getPrice());
            product.setInventory(request.getInventory());
            product.setHeight(request.getHeight());
            product.setLength(request.getLength());
            product.setWeight(request.getWeight());
            product.setWidth(request.getWidth());
            product.setShop(shop);
            log.info("Entity price = {}", product.getPrice());
            product = productRepository.save(product);
            log.info("Saved price = {}", product.getPrice());
            List<Image> images = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    String imageKey =
                            s3Service.uploadFile(file, "products/" + product.getId());
                    Image image = new Image();
                    image.setProduct(product);
                    image.setImageKey(imageKey);
                    imageRepository.save(image);
                    images.add(image);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
            product.setImage(images);
        }
        return product;
    }

    @Transactional
    @Override
    public ProductDto.ProductResponse addProduct(ProductDto.CreateRequest request, Long userId, List<MultipartFile> files) {
//        log.info("ProductServiceImpl.create");
        // check whether the product category is exist or else create new one
        Category category;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFound("Category with id [%s] not found".formatted(request.getCategoryId())));
        } else {
            category = Optional.ofNullable(categoryRepository.findByName(request.getCategoryName()))
                    .orElseGet(() -> {
                        Category category1 = new Category();
                        category1.setName(request.getCategoryName());

                        return category1;
                    });
        }

        Brand brand;
        // brand id is not null
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId()).orElseThrow(() -> new ResourceNotFound("Brand with id [%s] is not exist".formatted(request.getBrandId())));
        } else {
            brand = Optional.ofNullable(brandRepository.findByName(request.getBrandName()))
                    // create new brand
                    .orElseGet(() -> {
                        Brand brand1 = new Brand();
                        brand1.setName(request.getBrandName());

                        return brand1;
                    });
        }

        Shop shop = shopRepository.findById(request.getShopId()).orElseThrow(() -> new ResourceNotFound("Shop with id [%s] not found".formatted(request.getShopId())));
        assertShopOwnedBy(shop, userId);

        log.info("Service price = {}", request.getPrice());
        Product product = createProduct(request, brand, category, shop, files);
        return productMapper.toResponse(product);
    }

    @Override
    public void deleteProduct(Long productId, Long userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFound("Product with id [%s] not found".formatted(productId)));
        assertShopOwnedBy(product.getShop(), userId);
        productRepository.delete(product);
    }

    @Override
    public ProductDto.ProductResponse updateProduct(ProductDto.UpdateRequest request, Long productId, Long userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFound("Product with id [%s] not found".formatted(productId)));
        assertShopOwnedBy(product.getShop(), userId);
        updateExistProduct(request, product);
        return MapperUtil.mapObject(productRepository.save(product), ProductDto.ProductResponse.class);
    }

    private void assertShopOwnedBy(Shop shop, Long userId) {
        if (shop == null || shop.getUser() == null || !shop.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this shop");
        }
    }

    private Product updateExistProduct(ProductDto.UpdateRequest request, Product product) {
        if (request.getName() != null) product.setName(request.getName());
        if (request.getBrand() != null) product.setBrand(request.getBrand());
        if (request.getInventory() > 0) product.setInventory(request.getInventory());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        return product;
    }


    @Override
    public List<ProductDto.ProductResponse> getProductByCategory(Category category) {
//        return MapperUtil.mapList(productRepository.findByCategory_Name(category.getName()), ProductDto.ProductResponse.class);
        return productRepository.findByCategory_Name(category.getName())
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    public List<ProductDto.ProductResponse> getProductByBrand(Brand brand) {
        return productRepository.findByBrand_Name(brand.getName())
                .stream().map(productMapper::toResponse).toList();
    }

    @Override
    public List<ProductDto.ProductResponse> getAllProduct() {
        return productRepository.findAll().stream().map(productMapper::toResponse).toList();
    }

    @Override
    public Page<ProductDto.ProductResponse> getAllProduct(Pageable pageable) {
        return productRepository.findAll(pageable).map(productMapper::toResponse);
    }

    public List<ProductDto.ProductResponse> getProductsOfShop() {
        Long currentUser = AuthUtil.getCurrentUserId();
        Shop shop = shopRepository.findByUser_Id(currentUser).orElseThrow(() -> new ResourceNotFound("You do not own shop"));
        List<Product> products = productRepository.findByShop_Id(shop.getId());

        return MapperUtil.mapList(products, ProductDto.ProductResponse.class);
    }
}
