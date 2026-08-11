package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Role;
import com.ecommerce.ecommerce.util.status.RoleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleStatus(RoleStatus roleStatus);

    boolean existsByRoleStatus(RoleStatus roleStatus);
}
