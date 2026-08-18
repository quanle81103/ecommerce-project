package com.ecommerce.ecommerce.projection;

import java.math.BigDecimal;

public interface TopProductProjection {
    Long getProductId();
    String getProductName();
    Long getSold();
    BigDecimal getRevenue();
}
