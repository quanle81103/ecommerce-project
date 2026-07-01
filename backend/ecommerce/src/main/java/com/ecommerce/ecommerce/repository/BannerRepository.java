package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    @Query("SELECT max(b.displayOrder) from Banner b")
    Integer findMaxDisplayOrder();

    @Query("SELECT b FROM Banner b WHERE b.active = true AND b.startTime <= :now AND b.endTime >= :now ORDER BY b.displayOrder ASC")
    List<Banner> findAllActiveBannerBetween(@Param("now")LocalDateTime now);
}
