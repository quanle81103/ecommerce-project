package com.ecommerce.ecommerce.config.ghn;

import io.netty.resolver.DefaultAddressResolverGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Component
@RequiredArgsConstructor
public class GhnClientFactory {

    private static final int MAX_IN_MEMORY_SIZE = 10 * 1024 * 1024;

    private final GhnConfig ghnConfig;

    public WebClient create(String shopId, String token) {
        HttpClient httpClient = HttpClient.create()
                .resolver(DefaultAddressResolverGroup.INSTANCE);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(ghnConfig.getBaseUrl())
                .defaultHeader("ShopId", shopId)
                .defaultHeader("Token", token)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(MAX_IN_MEMORY_SIZE))
                .build();
    }
}
