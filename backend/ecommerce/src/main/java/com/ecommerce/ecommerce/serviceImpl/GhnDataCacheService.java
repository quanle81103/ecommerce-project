package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.config.ghn.GhnClientFactory;
import com.ecommerce.ecommerce.dto.GhnDto;
import com.ecommerce.ecommerce.exception.ExternalServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GhnDataCacheService {
    private final GhnClientFactory ghnClientFactory;

    @Cacheable(value = "ghn_shop_info", key = "#ghnShopId", sync = true)
    public List<GhnDto.GhnAddressResponse.GhnShopInfo> getShopList(String ghnToken, String ghnShopId) {
        WebClient webClient = ghnClientFactory.create(ghnShopId, ghnToken);

        GhnDto.GhnAddressResponse response = webClient.get().uri("/shiip/public-api/v2/shop/all")
                .retrieve().bodyToMono(GhnDto.GhnAddressResponse.class)
                .block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        return response.getData().getShops();
    }

    @Cacheable(value = "ghn_districts", key = "'all'", sync = true)
    public List<GhnDto.GhnDistrictResponse.DistrictDto> getDistricts(String token, String ghnShopId) {
        WebClient webClient = ghnClientFactory.create(ghnShopId, token);

        GhnDto.GhnDistrictResponse response = webClient.get().uri("/shiip/public-api/master-data/district")
                .retrieve().bodyToMono(GhnDto.GhnDistrictResponse.class)
                .block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        return response.getData();
    }

    @Cacheable(value = "ghn_wards", key = "#districtId", sync = true)
    public List<GhnDto.GhnWardResponse.WardDto> getWards(String token, String ghnShopId, Integer districtId) {
        WebClient webClient = ghnClientFactory.create(ghnShopId, token);

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

    @Cacheable(value = "ghn_provinces", key = "'all'", sync = true)
    public List<GhnDto.GhnProvinceResponse.ProvinceDto> getProvinces(String token, String ghnShopId) {
        WebClient webClient = ghnClientFactory.create(ghnShopId, token);


        GhnDto.GhnProvinceResponse response = webClient.get()
                .uri("/shiip/public-api/master-data/province")
                .retrieve().bodyToMono(GhnDto.GhnProvinceResponse.class)
                .block();

        if (response == null || response.getCode() != 200) {
            throw new ExternalServiceException("Unable to receive response from GHN");
        }

        return response.getData();
    }
}
