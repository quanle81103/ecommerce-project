package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Brand;
import com.ecommerce.ecommerce.dto.BrandDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.BrandRepository;
import com.ecommerce.ecommerce.service.BrandService;
import com.ecommerce.ecommerce.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    public BrandDto.BrandResponse createBrand(BrandDto.CreateBrandRequest request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        return MapperUtil.mapObject(brandRepository.save(brand), BrandDto.BrandResponse.class);
    }

    @Override
    public BrandDto.BrandResponse getBrandById(Long id) {
        return MapperUtil.mapObject(brandRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Brand not found")), BrandDto.BrandResponse.class);
    }

    @Override
    public Brand getBrandByName(String name) {
        return null;
    }

    @Override
    public List<Brand> getAllBrands() {
        return List.of();
    }

    @Override
    public void deleteBrand(Long id) {

    }

    @Override
    public Page<BrandDto.BrandResponse> getAll(Pageable pageable) {
        return brandRepository.findAll(pageable).map(b -> MapperUtil.mapObject(b, BrandDto.BrandResponse.class));
    }
}
