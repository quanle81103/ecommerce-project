package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dto.CategoryDto;
import com.ecommerce.ecommerce.exception.ResourceAlreadyExist;
import com.ecommerce.ecommerce.repository.CategoryRepository;
import com.ecommerce.ecommerce.service.CategoryService;
import com.ecommerce.ecommerce.dao.Category;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.util.Mapper.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepo;

    @Override
    public CategoryDto.CategoryResponse addCategory(CategoryDto.CreateCategoryRequest request) {
        if (categoryRepo.findByName(request.getName()) != null) {
           throw new ResourceAlreadyExist("Category already exist");
        }
        Category category = new Category();
        category.setName(request.getName());
        return MapperUtil.mapObject(categoryRepo.save(category), CategoryDto.CategoryResponse.class);
    }

    @Override
    public CategoryDto.CategoryResponse getCategoryById(Long categoryId) {
        return MapperUtil.mapObject(categoryRepo.findById(categoryId).orElseThrow(() -> new ResourceNotFound("Category with categoryId [%s] not found".formatted(categoryId))),CategoryDto.CategoryResponse.class);
    }

    @Override
    public CategoryDto.CategoryResponse getCategoryByName(String name) {
        return MapperUtil.mapObject(Optional.ofNullable(categoryRepo.findByName(name)).orElseThrow(() -> new ResourceNotFound("Category with name [%s] not found".formatted(name))), CategoryDto.CategoryResponse.class);
    }

    @Override
    public List<CategoryDto.CategoryResponse> getAllCategory() {
        return MapperUtil.mapList(categoryRepo.findAll(), CategoryDto.CategoryResponse.class);
    }
}
