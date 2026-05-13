package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.dao.Cart;
import com.ecommerce.ecommerce.dao.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemDto {
    private Long id;
    private int quantity;
    private BigDecimal unitPrice;
    @JsonIgnore
    private Product product;
}
