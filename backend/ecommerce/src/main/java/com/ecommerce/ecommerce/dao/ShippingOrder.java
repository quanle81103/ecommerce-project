package com.ecommerce.ecommerce.dao;

import com.ecommerce.ecommerce.util.status.ShippingStatus;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipping_orders")
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShippingOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    private String ghnOrderCode;
    private Integer shippingFee;
    private LocalDateTime expectedDeliveryTime;

    @Enumerated(EnumType.STRING)
    private ShippingStatus status;

    private LocalDateTime createdAt;
}
