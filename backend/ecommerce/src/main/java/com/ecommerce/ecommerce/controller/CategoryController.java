package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.CategoryDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.CategoryServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryServiceImpl categoryService;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/category/add")
    public ResponseObject<CategoryDto.CategoryResponse> addCategory(@Valid @RequestBody CategoryDto.CreateCategoryRequest request) {
        return new ResponseObject<>(HttpStatus.CREATED, "Success", categoryService.addCategory(request));
    }

    @GetMapping("/category/name/")
    public ResponseObject<CategoryDto.CategoryResponse> getCategoryByName(@RequestParam String name) {
        return new ResponseObject<>(HttpStatus.OK, "Success", categoryService.getCategoryByName(name));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseObject<CategoryDto.CategoryResponse> getCategoryById(@PathVariable Long categoryId)
    {
        return new ResponseObject<>(HttpStatus.OK, "Success", categoryService.getCategoryById(categoryId));
    }

    @GetMapping
    public ResponseObject<List<CategoryDto.CategoryResponse>> getAllCategory() {
        return new ResponseObject<>(HttpStatus.OK, "Success", categoryService.getAllCategory());
    }
}
