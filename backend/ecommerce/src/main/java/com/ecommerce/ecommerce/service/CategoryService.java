package com.ecommerce.ecommerce.service;

import com.ecommerce.ecommerce.dao.Category;
import com.ecommerce.ecommerce.dto.CategoryDto;

public interface CategoryService {
    CategoryDto.CategoryResponse addCategory(CategoryDto.CreateCategoryRequest request);
    CategoryDto.CategoryResponse getCategoryById(Long categoryId);
    CategoryDto.CategoryResponse getCategoryByName(String name);
}
