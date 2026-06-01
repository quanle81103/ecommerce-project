package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dao.Brand;
import com.ecommerce.ecommerce.dao.Category;
import com.ecommerce.ecommerce.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    ProductDto.ProductResponse getProductById(Long id);

    ProductDto.ProductResponse addProduct(ProductDto.CreateRequest request, Long userId);

    void deleteProduct(Long productId, Long userId);

    ProductDto.ProductResponse updateProduct(ProductDto.UpdateRequest request, Long productId, Long userId);

    List<ProductDto.ProductResponse> getProductByCategory(Category category);

    List<ProductDto.ProductResponse> getProductByBrand(Brand brand);

    List<ProductDto.ProductResponse> getAllProduct();

    Page<ProductDto.ProductResponse> getAllProduct(Pageable pageable);
}
