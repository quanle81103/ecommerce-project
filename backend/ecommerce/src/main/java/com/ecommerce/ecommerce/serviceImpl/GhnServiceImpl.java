package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.config.ghn.GhnConfig;
import com.ecommerce.ecommerce.config.ghn.GhnClientFactory;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class GhnServiceImpl implements GhnService {
    private final GhnConfig ghnConfig;
    private final GhnClientFactory ghnClientFactory;
    private final ShippingOrderRepository shippingOrderRepository;
    private final ShopRepository shopRepository;
    private final GhnDataCacheService ghnDataCacheService;

    private GhnDto.GhnAddressResponse.GhnShopInfo findShopInfo(String token, String ghnShopId) {
        return ghnDataCacheService.getShopList(token, ghnShopId).stream()
                .filter(shop -> shop.getShopId().equals(Integer.valueOf(ghnShopId)))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFound("Ghn shop not found"));
    }

    @Override
    public GhnDto.GhnAddressResponse.GhnShopInfo getInfo(String token, String ghnShopId) {
        return findShopInfo(token, ghnShopId);
    }

    @Override
    public GhnDto.GhnOrderResponse createOrder(String token, String ghnShopId, GhnDto.GhnCreateOrderRequest request) {
        WebClient webClient = ghnClientFactory.create(ghnShopId, token);

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

    // get Service_id
    public GhnDto.GhnAvailableServiceResponse getAvailableService(String token, String shopId, GhnDto.GhnAvailableServiceRequest request) {
        WebClient webClient = ghnClientFactory.create(shopId, token);

        try {
            GhnDto.GhnAvailableServiceResponse response = webClient.post().uri("/shiip/public-api/v2/shipping-order/available-services")
                    .bodyValue(request)
                    .retrieve()
                        .onStatus(HttpStatusCode::isError, res ->
                                res.bodyToMono(String.class)
                                        .flatMap(body -> Mono.error(
                                                new ExternalServiceException(
                                                        "GHN error: " + body
                                                )))
                        )
                        .bodyToMono(GhnDto.GhnAvailableServiceResponse.class)
                        .block();

            if (response == null) {
                throw new ExternalServiceException("Unable to receive response from GHN");
            }

            if (response.getCode() != 200) {
                throw new ExternalServiceException(response.getMessage());
            }

            return response;

        } catch (ExternalServiceException e) {
            throw e;

        } catch (Exception e) {
            log.error("Error getting available services: {}", e.getMessage());

            throw new ExternalServiceException(
                    "Unable to get available services: " + e.getMessage(),
                    e
            );
        }
    }

    @Override
    public GhnDto.GhnShippingOrderFeeResponse getShippingFee(String shopId, String token, GhnDto.GhnShippingOrderFeeRequest request) {

        WebClient webClient = ghnClientFactory.create(shopId, token);

        try {

            GhnDto.GhnShippingOrderFeeResponse response =
                    webClient.post()
                            .uri("/shiip/public-api/v2/shipping-order/fee")
                            .bodyValue(request)
                            .retrieve()
                            .onStatus(HttpStatusCode::isError, clientResponse ->
                                    clientResponse.bodyToMono(String.class)
                                            .flatMap(body -> Mono.error(
                                                    new ExternalServiceException(
                                                            "GHN Fee API Error: " + body
                                                    )
                                            ))
                            )
                            .bodyToMono(GhnDto.GhnShippingOrderFeeResponse.class)
                            .block();

            if (response == null) {
                throw new ExternalServiceException("No response from GHN Fee API");
            }

            if (response.getCode() != 200) {
                throw new ExternalServiceException(response.getMessage());
            }

            return response;

        } catch (ExternalServiceException e) {
            throw e;

        } catch (Exception e) {
            log.error("Error while calculating shipping fee", e);

            throw new ExternalServiceException(
                    "Unable to calculate shipping fee",
                    e
            );
        }
    }

    @Override
    public GhnDto.GhnLeadTimeResponse getLeadTime(String shopId, String token, GhnDto.GhnLeadTime request) {
        WebClient webClient = ghnClientFactory.create(shopId, token);
        try {

            GhnDto.GhnLeadTimeResponse response =
                    webClient.post()
                            .uri("/shiip/public-api/v2/shipping-order/leadtime")
                            .bodyValue(request)
                            .retrieve()
                            .onStatus(HttpStatusCode::isError, clientResponse ->
                                    clientResponse.bodyToMono(String.class)
                                            .flatMap(body -> Mono.error(
                                                    new ExternalServiceException(
                                                            "GHN Fee API Error: " + body
                                                    )
                                            ))
                            )
                            .bodyToMono(GhnDto.GhnLeadTimeResponse.class)
                            .block();

            if (response == null) {
                throw new ExternalServiceException("No response from GHN Lead time API");
            }

            if (response.getCode() != 200) {
                throw new ExternalServiceException(response.getMessage());
            }

            return response;

        } catch (ExternalServiceException e) {
            throw e;

        } catch (Exception e) {
            log.error("Error while calculating lead time", e);

            throw new ExternalServiceException("Unable to calculate lead time", e);
        }
    }

    @Override
    public boolean verifyGhnCredentials(String ghnToken, String shopId) {
        log.info("GHN verify — baseUrl=[{}], shopId=[{}], tokenLen={}",
                ghnConfig.getBaseUrl(), shopId, ghnToken == null ? 0 : ghnToken.length());
        WebClient webClient = ghnClientFactory.create(shopId, ghnToken);

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

    @Override
    public String getDistrictName(String token, String ghnShopId) {
        Integer districtId = getInfo(token, ghnShopId).getDistrictId();
        return ghnDataCacheService.getDistricts(token, ghnShopId).stream().filter(d -> d.getDistrictId().equals(districtId))
                .map(GhnDto.GhnDistrictResponse.DistrictDto::getDistrictName)
                .findFirst().orElseThrow(() -> new ResourceNotFound("GHN master-data lookup failed"));
    }

    @Override
    public String getWardName(String token, String ghnShopId) {
        GhnDto.GhnAddressResponse.GhnShopInfo shopInfo = findShopInfo(token, ghnShopId);

        return ghnDataCacheService.getWards(token, ghnShopId, shopInfo.getDistrictId()).stream().filter(d -> d.getWardCode().equals(shopInfo.getWardCode()))
                .map(GhnDto.GhnWardResponse.WardDto::getWardName)
                .findFirst().orElseThrow(() -> new ResourceNotFound("GHN master-data lookup failed"));
    }

    @Override
    public String getProvinceName(String token, String ghnShopId) {
        Integer districtId = findShopInfo(token, ghnShopId).getDistrictId();
        Integer provinceId = ghnDataCacheService.getDistricts(token, ghnShopId).stream()
                .filter(d -> d.getDistrictId().equals(districtId))
                .map(GhnDto.GhnDistrictResponse.DistrictDto::getProvinceId)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFound("Province id not found"));

        return ghnDataCacheService.getProvinces(token, ghnShopId).stream()
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
        WebClient webClient = ghnClientFactory.create(ghnShopId, ghnToken);

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
