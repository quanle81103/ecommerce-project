package com.ecommerce.ecommerce.config.ghn;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class GhnConfig {
    @Value("${ghn.token}")
    private String token;

    @Value("${ghn.base_url}")
    private String baseUrl;
}
