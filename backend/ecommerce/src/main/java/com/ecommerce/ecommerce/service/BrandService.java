package com.ecommerce.ecommerce.service;


import com.ecommerce.ecommerce.dao.Brand;
import com.ecommerce.ecommerce.dto.BrandDto;

import java.util.List;

public interface BrandService {
    BrandDto.BrandResponse createBrand(BrandDto.CreateBrandRequest request);

    BrandDto.BrandResponse getBrandById(Long id);

    Brand getBrandByName(String name);

    List<Brand> getAllBrands();

    void deleteBrand(Long id);
}
