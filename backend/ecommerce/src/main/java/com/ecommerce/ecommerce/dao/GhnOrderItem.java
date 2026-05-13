package com.ecommerce.ecommerce.dao;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Builder
@Getter
@Setter

public class GhnOrderItem {
    private String name;
    private String code;
    private int quantity;
    private int price;
    private int weight;
}
