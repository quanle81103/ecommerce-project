package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findIdByUser_Id(Long userId);
}
