package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Payment;
import com.ecommerce.ecommerce.util.status.PaymentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Payment p WHERE p.txnRef = :txnRef")
    Optional<Payment> findByTxnRefForUpdate(@Param("txnRef") String txnRef);

    Payment findByTxnRef(String txnRef);

    List<Payment> findByPaymentStatusAndCreateAtBefore(PaymentStatus status, LocalDateTime time);
}
