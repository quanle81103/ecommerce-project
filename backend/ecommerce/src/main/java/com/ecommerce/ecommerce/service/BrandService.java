package com.ecommerce.ecommerce.service;


import com.ecommerce.ecommerce.dao.Brand;
import com.ecommerce.ecommerce.dto.BrandDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BrandService {
    BrandDto.BrandResponse createBrand(BrandDto.CreateBrandRequest request);

    BrandDto.BrandResponse getBrandById(Long id);

    Brand getBrandByName(String name);

    List<Brand> getAllBrands();

    void deleteBrand(Long id);

    Page<BrandDto.BrandResponse> getAll(Pageable pageable);
}
