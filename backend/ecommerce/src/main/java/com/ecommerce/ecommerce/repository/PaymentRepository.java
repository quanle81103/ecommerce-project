package com.ecommerce.ecommerce.repository;

import com.ecommerce.ecommerce.dao.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByTxnRef(String txnRef);
}
