package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findByName(String name);
    List<Product> findByCategory_Name(String categoryName);
    List<Product> findByBrand_Name(String brandName);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Product p SET p.inventory = p.inventory - :qty " + "WHERE p.id = :id AND p.inventory >= :qty")
    int decreaseInventory(@Param("id") Long id, @Param("qty") int quantity);

    @Modifying
    @Query("UPDATE Product p SET p.inventory = p.inventory + :qty " + "WHERE p.id = :id")
    int restoreInventory(@Param("id") Long id, @Param("qty") int quantity);
}
