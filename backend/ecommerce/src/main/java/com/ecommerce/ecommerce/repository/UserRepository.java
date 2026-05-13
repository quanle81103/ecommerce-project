package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dao.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    boolean existsByEmail(String email);

}
