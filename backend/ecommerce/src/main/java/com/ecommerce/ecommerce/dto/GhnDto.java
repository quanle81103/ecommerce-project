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
            private String wardCode;
        }
    }

    @Data
    @Builder
    public static class GhnAvailableServiceRequest {
        private int from_district;
        private int to_district;
        private int shop_id;
    }

    @Data
    public static class GhnAvailableServiceResponse {
        private int code;
        private String message;
        private List<ServiceData> data;

        @Data
        public static class ServiceData {
            @JsonProperty("service_id")
            private Integer serviceId;

            // nhanh, chuủn, tiết kiệm
            @JsonProperty("short_name")
            private String shortName;

            @JsonProperty("service_type_id")
            private Integer serviceTypeId;
        }
    }

    @Data
    @Builder
    public static class GhnShippingOrderFeeRequest {
        private Long shopId;
        private String serviceName;
        private String expectedDelivery;
        @JsonProperty("to_ward_code")
        private String toWardCode;

        @JsonProperty("to_district_id")
        private int toDistrictId;

        @JsonProperty("service_type_id")
        private int serviceTypeId;

        @JsonProperty("insurance_value")
        private int insuranceValue;

        @JsonProperty("from_district_id")
        private int fromDistrictId;

        @JsonProperty("from_ward_code")
        private String fromWardCode;
        private int weight;
        private int length;
        private int width;
        private int height;
    }

    // for fe send request
    @Data
    public static class GhnShippingFeeRequest {
        private String toWardCode;
        private int toDistrictId;
        private Long shopId;
    }

       @Data
    @Builder
    public static class ShippingFeeResponse {
        private Long shopId;
        private Integer total;
        private String serviceName;
        private Long expectedDelivery;
    }

    @Data
    public static class GhnShippingOrderFeeResponse {
        private int code;
        private String message;
        private ShippingFeeData data;
//        private String serviceName;
//        private String expectedDelivery;
        @Data
        public static class ShippingFeeData {
            private Integer total;

            @JsonProperty("service_fee")
            private Integer serviceFee;

            @JsonProperty("insurance_fee")
            private Integer insuranceFee;

//            @JsonProperty("pick_station_fee")
//            private Integer pickStationFee;
//
//            @JsonProperty("coupon_value")
//            private Integer couponValue;
//
//            @JsonProperty("r2s_fee")
//            private Integer r2sFee;
//
//            @JsonProperty("document_return")
//            private Integer documentReturn;
//
//            @JsonProperty("double_check")
//            private Integer doubleCheck;
//
//            @JsonProperty("cod_fee")
//            private Integer codFee;
//
//            @JsonProperty("pick_remote_areas_fee")
//            private Integer pickRemoteAreasFee;
//
//            @JsonProperty("deliver_remote_areas_fee")
//            private Integer deliverRemoteAreasFee;
//
//            @JsonProperty("cod_failed_fee")
//            private Integer codFailedFee;
        }
    }

    @Data
    @Builder
    public static class GhnLeadTime {
        @JsonProperty("from_district_id")
        private int fromDistrictId;
        @JsonProperty("to_district_id")
        private int toDistrictId;
        @JsonProperty("to_ward_code")
        private String toWardCode;
        @JsonProperty("service_id")
        private Integer serviceId;
        @JsonProperty("from_ward_code")
        private String fromWardCode;
        @JsonProperty("shop_id")
        private Long shopId;
    }

    @Data
    public static class GhnLeadTimeResponse {
        private int code;
        private String message;
        private LeadTimeData data;

        @Data
        public static class LeadTimeData {
            private String leadtime;
            private String orderDate;
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
            private String wardCode;
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
            private String wardCode;

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
