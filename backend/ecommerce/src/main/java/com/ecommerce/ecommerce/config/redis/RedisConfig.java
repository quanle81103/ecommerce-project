package com.ecommerce.ecommerce.config.redis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
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
        RedisCacheConfiguration baseConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(baseConfig.entryTtl(Duration.ofMinutes(defaultTtl)))
                .withCacheConfiguration("ghn_shop_info", baseConfig.entryTtl(Duration.ofMinutes(shopTtl)))
                .withCacheConfiguration("ghn_districts", baseConfig.entryTtl(Duration.ofHours(districtTtl)))
                .withCacheConfiguration("ghn_wards", baseConfig.entryTtl(Duration.ofHours(wardTtl)))
                .withCacheConfiguration("ghn_provinces", baseConfig.entryTtl(Duration.ofHours(provinceTtl)))
                .build();
    }
}
