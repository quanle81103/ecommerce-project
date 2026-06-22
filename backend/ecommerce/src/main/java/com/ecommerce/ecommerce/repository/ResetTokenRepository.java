package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.ResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
    @Query("SELECT r FROM ResetToken r WHERE r.tokenHash = :tokenHash")
    Optional<ResetToken> findByHashToken(@Param("tokenHash") String tokenHash);
}
