package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dao.OrderItem;
import com.ecommerce.ecommerce.dao.Payment;
import com.ecommerce.ecommerce.repository.PaymentRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.util.status.OrderStatus;
import com.ecommerce.ecommerce.util.status.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderTimeoutJob {
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void releaseExpireOrders() {
        LocalDateTime time = LocalDateTime.now().minusMinutes(15);
        List<Payment> expired = paymentRepository.findByPaymentStatusAndCreateAtBefore(PaymentStatus.PENDING, time);

        for (Payment payment : expired) {
            for (Order order : payment.getOrders()) {
                if (order.getOrderStatus() == OrderStatus.PENDING) {
                    for (OrderItem item : order.getOrderitems()) {
                        productRepository.restoreInventory(item.getProduct().getId(), item.getQuantity());
                    }
                    order.setOrderStatus(OrderStatus.CANCELLED);
                }
            }
            payment.setPaymentStatus(PaymentStatus.FAILED);
        }
    }
}
