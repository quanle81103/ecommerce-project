package com.ecommerce.ecommerce.controller;

import com.ecommerce.ecommerce.dto.PaymentDto;
import com.ecommerce.ecommerce.response.ResponseObject;
import com.ecommerce.ecommerce.serviceImpl.PaymentServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentServiceImpl paymentService;

    @GetMapping("/vn-pay")
    public ResponseObject<PaymentDto.VnPayResponse> createVnPayPayment(HttpServletRequest request) throws ServletException {
        return new ResponseObject<>(HttpStatus.OK, "Success", paymentService.createVnPayPayment(request));
    }

    // IPN: VNPay server gọi để cập nhật DB
    @GetMapping("/vnpay-ipn")
    public ResponseObject<PaymentDto.VnPayResponse> ipnHandler(HttpServletRequest request) {
        String code = request.getParameter("vnp_ResponseCode");
        if (code.equals("00")) {
            return new ResponseObject<>(HttpStatus.OK, "Success", paymentService.processVnpayIpn(request));
        } else {
            return new ResponseObject<>(HttpStatus.BAD_REQUEST, "Failed", null);
        }
    }

    // Return URL: redirect browser sau khi thanh toán
    @GetMapping("/vnpay-callback")
    public ResponseObject<PaymentDto.VnPayResponse> callbackHandler(HttpServletRequest request) {
        return new ResponseObject<>(HttpStatus.OK, "OK", paymentService.returnUrl(request));
    }
}
