package com.ecommerce.ecommerce.dto;

import com.ecommerce.ecommerce.dao.GhnOrderItem;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.mail.Address;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

public abstract class GhnDto {
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GhnCreateOrderRequest {
        private String token;
        private int shopId;
        @JsonProperty("from_name")
        private String fromName;
        @JsonProperty("from_phone")
        private String fromPhone;
        @JsonProperty("from_address")
        private String fromAddress;
        @JsonProperty("from_ward_name")
        private String fromWardName;
        @JsonProperty("from_district_name")
        private String fromDistrictName;
        @JsonProperty("from_province_name")
        private String fromProvinceName;
        @JsonProperty("to_name")
        private String toName;
        @JsonProperty("to_phone")
        private String toPhone;
        @JsonProperty("to_address")
        private String toAddress;
        @JsonProperty("to_ward_code")
        private String toWardCode;
        @JsonProperty("to_district_id")
        private int toDistrictId;
        private int weight;
        private int length;
        private int width;
        private int height;
        @JsonProperty("service_type_id")
        private int serviceTypeId;
        @JsonProperty("payment_type_id")
        private int paymentTypeId;
        @JsonProperty("required_note")
        private String requiredNote;
        private List<GhnOrderItem> items;
    }

    @Data
    @Getter
    @Setter
    public static class GhnOrderResponse {

        private int code;
        private String message;
        private Data data;


        @lombok.Data
        public static class Data {
            @JsonProperty("order_code")
            private String orderCode;

            @JsonProperty("total_fee")
            private int totalFee;

            @JsonProperty("expected_delivery_time")
            private String expectedDeliveryTime;
        }
    }

    @Data
    @Getter
    @Setter
    public static class GhnShopResponse {
        private int code;
        private String message;
        @JsonProperty("data")
        private ShopData data;

        @Getter
        @Setter
        public static class ShopData {
            @JsonProperty("last_offset")
            private Long lastOffset;

            @JsonProperty("shops")
            private List<GhnShopData> shops;

        }

        @Getter
        @Setter
        public static class GhnShopData {
            @JsonProperty("_id")
            private Integer shopId;
            private String name;
            private String phone;
            private String address;

            @JsonProperty("district_id")
            private Integer districtId;

            @JsonProperty("ward_code")
            private Integer wardCode;
        }
    }


    @Data
    public static class GhnConnectRequest {
        @NotBlank
        private String ghnToken;

        @NotNull
        private String ghnShopId;
    }

    @Data
    public static class GhnAddressResponse {
        private int code;
        private String message;
        @JsonProperty("data")
        private ShopInfo data;

        @Getter
        @Setter
        public static class ShopInfo {
            @JsonProperty("last_offset")
            private Long lastOffset;

            @JsonProperty("shops")
            private List<GhnShopInfo> shops;

        }

        @Getter
        @Setter
        public static class GhnShopInfo {
            @JsonProperty("_id")
            private Integer shopId;
            private String name;
            private String phone;
            private String address;

            @JsonProperty("district_id")
            private Integer districtId;

            @JsonProperty("ward_code")
            private Integer wardCode;
        }
    }

    @Data
    public static class GhnDistrictResponse {
        private int code;
        private String message;
        private List<DistrictDto> data;

        @Getter
        @Data
        public static class DistrictDto {

            @JsonProperty("DistrictID")
            private Integer districtId;

            @JsonProperty("DistrictName")
            private String districtName;

            @JsonProperty("ProvinceID")
            private Integer provinceId;
        }
    }

    @Data
    public static class GhnWardResponse {
        private int code;
        private String message;
        private List<WardDto> data;

        @Data
        public static class WardDto {

            @JsonProperty("WardCode")
            private Integer wardCode;

            @JsonProperty("WardName")
            private String wardName;
        }
    }

    @Data
    public static class GhnProvinceResponse {
        private int code;
        private String message;
        private List<ProvinceDto> data;

        @Data
        public static class ProvinceDto {

            @JsonProperty("ProvinceID")
            private Integer provinceId;

            @JsonProperty("ProvinceName")
            private String provinceName;
        }
    }

    @Data
    public static class GhnCancelOrderRequest {
        @NotEmpty
        @JsonProperty("order_codes")
        private List<String> orderCodes;
    }

    @Data
    public static class GhnCancelOrderResponse {
        private int code;
        private String message;
        private List<CancelOrderData> data;

        private  static class CancelOrderData {
            @JsonProperty("order_code")
            private String orderCode;

            private Boolean result;

            private String message;
        }
    }

}
