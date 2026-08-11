package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dao.Brand;
import com.ecommerce.ecommerce.dao.Category;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dto.ProductDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.ProductServiceImpl;
import com.ecommerce.ecommerce.util.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor

public class ProductController {
    private final ProductServiceImpl productService;

    @GetMapping("/{productId}")
    public ResponseObject<ProductDto.ProductResponse> getProductById(@PathVariable Long productId) {
        return new ResponseObject<>(HttpStatus.OK, "Success", productService.getProductById(productId));
    }

    @GetMapping("/product/all")
    public ResponseObject<List<ProductDto.ProductResponse>>  getAllProducts() {
        return new ResponseObject<>(HttpStatus.OK, "Success", productService.getAllProduct());
    }

    @GetMapping("/product/by/brand")
    public ResponseObject<List<ProductDto.ProductResponse>> getProductByBrand(@RequestParam Brand brand) {
        return new ResponseObject<>(HttpStatus.OK, "Success", productService.getProductByBrand(brand));
    }

    @GetMapping("/product/by/category")
    public ResponseObject<List<ProductDto.ProductResponse>> getProductByCategory(@RequestParam Category category) {
        return new ResponseObject<>(HttpStatus.OK, "Success", productService.getProductByCategory(category));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PostMapping(value = "/product/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseObject<ProductDto.ProductResponse> addProduct(@Valid @ModelAttribute ProductDto.CreateRequest request, @RequestParam("files") List<MultipartFile> files) {
        log.info("Controller price = {}", request.getPrice());

        return new ResponseObject<>(HttpStatus.CREATED, "Success",
                productService.addProduct(request, AuthUtil.getCurrentUserId(), files));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @DeleteMapping("/product/delete/{productId}")
    public ResponseObject<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId, AuthUtil.getCurrentUserId());
        return new ResponseObject<>(HttpStatus.OK, "Success", null);
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @PutMapping("/update/product/{productId}")
    public ResponseObject<ProductDto.ProductResponse> updateProduct(@Valid @RequestBody ProductDto.UpdateRequest request, @PathVariable Long productId) {
        return new ResponseObject<>(HttpStatus.OK, "Success",
                productService.updateProduct(request, productId, AuthUtil.getCurrentUserId()));
    }

    // for pagination purpose
    @GetMapping
    public ResponseObject<Page<ProductDto.ProductResponse>> getAll(@PageableDefault(size = 20) Pageable pageable) {
        return new ResponseObject<>(HttpStatus.OK, "Success", productService.getAllProduct(pageable));
    }

    @PreAuthorize("hasRole('SHOP_OWNER')")
    @GetMapping("/my")
    public ResponseObject<List<ProductDto.ProductResponse>> getProductSOfShop() {
        return new ResponseObject<>(HttpStatus.OK, "Success", productService.getProductsOfShop());
    }
}
