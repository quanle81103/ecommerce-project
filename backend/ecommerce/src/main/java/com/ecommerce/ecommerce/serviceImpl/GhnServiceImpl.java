package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.config.ghn.GhnConfig;
import com.ecommerce.ecommerce.dao.ShippingOrder;
import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dto.GhnDto;
import com.ecommerce.ecommerce.exception.BusinessException;
import com.ecommerce.ecommerce.exception.ExternalServiceException;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.ShippingOrderRepository;
import com.ecommerce.ecommerce.repository.ShopRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import com.ecommerce.ecommerce.service.GhnService;
import com.ecommerce.ecommerce.util.status.ShippingStatus;
import io.netty.resolver.DefaultAddressResolverGroup;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GhnServiceImpl implements GhnService {
    private final GhnConfig ghnConfig;
    private final WebClient.Builder webClientBuilder;
    private final ShippingOrderRepository shippingOrderRepository;
    private final ShopRepository shopRepository;
    // Create webClient per shop

    private WebClient buildClient(String shopId, String token) {
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
                        .maxInMemorySize(10 * 1024 * 1024))
                .build();
    }

    @Override
    public GhnDto.GhnOrderResponse createOrder(String token, String ghnShopId, GhnDto.GhnCreateOrderRequest request) {
        WebClient webClient = buildClient(ghnShopId, token);

        try {
            GhnDto.GhnOrderResponse response = webClient.post().uri("/shiip/public-api/v2/shipping-order/create")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, res ->
                            res.bodyToMono(String.class)
                                    .flatMap(body -> Mono.error(
                                            new ExternalServiceException("GHN error: " + body)))
                    )
                    .bodyToMono(GhnDto.GhnOrderResponse.class)
                    .block();

            if (response == null) {
                throw new ExternalServiceException("GHN tạo đơn thất bại");
            }

            log.info("Shop {} GHN order created: {}", ghnShopId, response.getData().getOrderCode());
            return response;
        } catch (ExternalServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("[Shop {}] Error create orders GHN: {}", ghnShopId, e.getMessage());
            throw new ExternalServiceException("Unable to create order: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean verifyGhnCredentials(String ghnToken, String shopId) {
        log.info("GHN verify — baseUrl=[{}], shopId=[{}], tokenLen={}",
                ghnConfig.getBaseUrl(), shopId, ghnToken == null ? 0 : ghnToken.length());
        WebClient webClient = buildClient(shopId, ghnToken);

        try {
            GhnDto.GhnShopResponse response = webClient.post().uri("/shiip/public-api/v2/shop/all")
                    .retrieve().bodyToMono(GhnDto.GhnShopResponse.class)
                    .block();

            if (response == null) {
                throw new ExternalServiceException("Unable to receive response from GHN");
            }

            if (response.getCode() != 200) {
                throw new ExternalServiceException("GHN error: " + response.getMessage());
            }

            return response.getData().getShops().stream().anyMatch(shopData -> shopData.getShopId().equals(Integer.valueOf(shopId)));
        } catch (ExternalServiceException e) {
            throw e;
        } catch (WebClientResponseException.Unauthorized e) {
            throw new ExternalServiceException("Invalid Token GHN", e);

        } catch (WebClientResponseException.Forbidden e) {
            throw new ExternalServiceException("No permission to access this shop", e);

        } catch (WebClientResponseException e) {
            throw new ExternalServiceException("GHN API error: " + e.getResponseBodyAsString(), e);

        } catch (Exception e) {
            log.error("Authentication error GHN", e);
            throw new ExternalServiceException("Authentication error GHN: " + e.getMessage(), e);
        }
    }

    @Cacheable(value = "ghn_shop_info", key = "#ghnShopId")
    public List<GhnDto.GhnAddressResponse.GhnShopInfo> getShopList(String ghnToken, String ghnShopId) {
        WebClient webClient = buildClient(ghnShopId, ghnToken);

        GhnDto.GhnAddressResponse response = webClient.get().uri("/shiip/public-api/v2/shop/all")
                .retrieve().bodyToMono(GhnDto.GhnAddressResponse.class)
                .block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        return response.getData().getShops();
    }

    @Override
    public GhnDto.GhnAddressResponse.GhnShopInfo getInfo(String ghnToken, String ghnShopId) {
        return getShopList(ghnToken, ghnShopId).stream().filter(a -> a.getShopId().equals(Integer.valueOf(ghnShopId))).findFirst().orElseThrow(() -> new ResourceNotFound("Not found"));
    }

    @Cacheable(value = "ghn_districts", key = "'all'")
    private List<GhnDto.GhnDistrictResponse.DistrictDto> getDistrict(String token, String ghnShopId) {
        WebClient webClient = buildClient(ghnShopId, token);

        GhnDto.GhnDistrictResponse response = webClient.get().uri("/shiip/public-api/master-data/district")
                .retrieve().bodyToMono(GhnDto.GhnDistrictResponse.class)
                .block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        return response.getData();
    }

    @Override
    public String getDistrictName(String token, String ghnShopId) {
        Integer districtId = getInfo(token, ghnShopId).getDistrictId();
        return getDistrict(token, ghnShopId).stream().filter(d -> d.getDistrictId().equals(districtId))
                .map(GhnDto.GhnDistrictResponse.DistrictDto::getDistrictName)
                .findFirst().orElseThrow(() -> new ResourceNotFound("GHN master-data lookup failed"));
    }

    @Cacheable(value = "ghn_wards", key = "#districtId")
    private List<GhnDto.GhnWardResponse.WardDto> getWard(String token, String ghnShopId) {
        WebClient webClient = buildClient(ghnShopId, token);

        var info = getInfo(token, ghnShopId);
//        Integer wardCode = info.getWardCode();
        Integer districtId = info.getDistrictId();

        GhnDto.GhnWardResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/shiip/public-api/master-data/ward")
                        .queryParam("district_id", districtId).build())
                .retrieve().bodyToMono(GhnDto.GhnWardResponse.class)
                .block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        return response.getData();
    }
    @Override
    public String getWardName(String token, String ghnShopId) {
        String wardCode = getInfo(token, ghnShopId).getWardCode();
        return getWard(token, ghnShopId).stream().filter(d -> d.getWardCode().equals(wardCode))
                .map(GhnDto.GhnWardResponse.WardDto::getWardName)
                .findFirst().orElseThrow(() -> new ResourceNotFound("GHN master-data lookup failed"));
    }

    @Cacheable(value = "ghn_provinces", key = "'all'")
    private List<GhnDto.GhnProvinceResponse.ProvinceDto> getProvince(String token, String ghnShopId) {
        WebClient webClient = buildClient(ghnShopId, token);


        GhnDto.GhnProvinceResponse response = webClient.get()
                .uri("/shiip/public-api/master-data/province")
                .retrieve().bodyToMono(GhnDto.GhnProvinceResponse.class)
                .block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        return response.getData();
    }
    @Override
    public String getProvinceName(String token, String ghnShopId) {
        Integer districtId = getInfo(token, ghnShopId).getDistrictId();
        Integer provinceId = getDistrict(token, ghnShopId).stream()
                .filter(d -> d.getDistrictId().equals(districtId))
                .map(GhnDto.GhnDistrictResponse.DistrictDto::getProvinceId)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFound("Province id not found"));

        return getProvince(token, ghnShopId).stream()
                .filter(p -> p.getProvinceId().equals(provinceId))
                .map(GhnDto.GhnProvinceResponse.ProvinceDto::getProvinceName)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFound("GHN master-data lookup failed"));
    }

    @Override
    public GhnDto.GhnCancelOrderResponse cancelOrderForShop(Long shopId, Long userId, GhnDto.GhnCancelOrderRequest request) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFound("Shop with id [%s] not found".formatted(shopId)));
        if (shop.getUser() == null || !shop.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this shop");
        }
        if (!shop.isGhnConnected() || shop.getGhnToken() == null || shop.getGhnShopId() == null) {
            throw new BusinessException(HttpStatus.CONFLICT, "Shop has not connected to GHN");
        }
        return cancelOrder(shop.getGhnToken(), String.valueOf(shop.getGhnShopId()), request);
    }

    @Transactional
    @Override
    public GhnDto.GhnCancelOrderResponse cancelOrder(String ghnToken, String ghnShopId, GhnDto.GhnCancelOrderRequest request) {
        WebClient webClient = buildClient(ghnShopId, ghnToken);

        // in order to use bodyValue have to user post method
        GhnDto.GhnCancelOrderResponse response = webClient.post()
                .uri("/shiip/public-api/v2/switch-status/cancel")
                .bodyValue(request)
                .retrieve().bodyToMono(GhnDto.GhnCancelOrderResponse.class).block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        for (String orderCode : request.getOrderCodes()) {
            ShippingOrder shippingOrder = shippingOrderRepository.findByGhnOrderCode(orderCode);
            if (shippingOrder != null) {
                shippingOrder.setStatus(ShippingStatus.CANCELLED);
                shippingOrderRepository.save(shippingOrder);
            }
        }
        return response;
    }
}
