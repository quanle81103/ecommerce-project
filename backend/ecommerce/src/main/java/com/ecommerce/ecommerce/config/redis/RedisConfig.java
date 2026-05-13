package com.ecommerce.ecommerce.config.redis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Value("${ghn.cache.shop-ttl}")
    private int shopTtl;

    @Value("${ghn.cache.ward-ttl}")
    private int wardTtl;

    @Value("${ghn.cache.district-ttl}")
    private int districtTtl;

    @Value("${ghn.cache.province-ttl}")
    private int provinceTtl;

    @Value("${ghn.cache.default}")
    private int defaultTtl;

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(defaultTtl))
                .disableCachingNullValues();

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withCacheConfiguration("ghn_shop_info", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(shopTtl)))
                .withCacheConfiguration("ghn_districts", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(districtTtl)))
                .withCacheConfiguration("ghn_wards", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(wardTtl)))
                .withCacheConfiguration("ghn_provinces", RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofHours(provinceTtl)))
                .build();
    }
}
