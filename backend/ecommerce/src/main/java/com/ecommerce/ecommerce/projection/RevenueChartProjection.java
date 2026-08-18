package com.ecommerce.ecommerce.projection;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface RevenueChartProjection {
    LocalDate getDate();
    BigDecimal getRevenue();
}