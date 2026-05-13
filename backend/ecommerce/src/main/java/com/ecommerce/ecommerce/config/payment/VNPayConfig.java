package com.ecommerce.ecommerce.config.payment;

import com.ecommerce.ecommerce.util.VnPayUtil;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Getter
@Configuration
public class VNPayConfig {
    @Value("${payment.vnPay.tmnCode}")
    private String vnp_TmnCode;

    @Value("${payment.vnPay.version}")
    private String vnp_Version;

    @Value("${payment.vnPay.payUrl}")
    private String vnp_PayUrl;

    @Value("${payment.vnPay.returnUrl}")
    private String vnp_ReturnUrl;

    @Value("${payment.vnPay.command}")
    private String vnp_Command;

    @Value("${payment.vnPay.orderType}")
    private String vnp_OrderType;

    @Value("${payment.vnPay.hashSecret}")
    private String hashSecret;

    public Map<String, String> getVnPayParams() {
        Map<String, String> vnPayParams = new HashMap<>();
        vnPayParams.put("vnp_Version", this.vnp_Version);
        vnPayParams.put("vnp_Command", this.vnp_Command);
        vnPayParams.put("vnp_TmnCode", this.vnp_TmnCode);
        vnPayParams.put("vnp_CurrCode", "VND");
        vnPayParams.put("vnp_Locale", "vn");
        vnPayParams.put("vnp_BankCode", "NCB");
        vnPayParams.put("vnp_OrderType", this.vnp_OrderType);
        vnPayParams.put("vnp_ReturnUrl", this.vnp_ReturnUrl);
//        vnPayParams.put("vnp_TxnRef", VnPayUtil.getRandomNumber(8));
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = simpleDateFormat.format(calendar.getTime());
        vnPayParams.put("vnp_CreateDate", vnp_CreateDate);
        calendar.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = simpleDateFormat.format(calendar.getTime());
        vnPayParams.put("vnp_ExpireDate", vnp_ExpireDate);
        return vnPayParams;
    }
}
