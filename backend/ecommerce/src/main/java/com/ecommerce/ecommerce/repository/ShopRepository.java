package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dao.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByUser_Id(Long userId);
//    Optional<Shop> findByGhn_Shop_Id(Long ghnShopId);
}
