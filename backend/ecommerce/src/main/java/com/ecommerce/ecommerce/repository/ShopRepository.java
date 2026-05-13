package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
}
