package com.ecommerce.ecommerce.serviceImpl;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce.config.ghn.GhnConfig;
import com.ecommerce.ecommerce.config.payment.VNPayConfig;
import com.ecommerce.ecommerce.dao.GhnOrderItem;
import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dao.OrderItem;
import com.ecommerce.ecommerce.dao.Payment;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dao.ShippingOrder;
import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.GhnDto;
import com.ecommerce.ecommerce.dto.PaymentDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.PaymentRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.repository.ShippingOrderRepository;
import com.ecommerce.ecommerce.util.VnPayUtil;
import com.ecommerce.ecommerce.util.status.OrderStatus;
import com.ecommerce.ecommerce.util.status.PaymentStatus;
import com.ecommerce.ecommerce.util.status.ShippingStatus;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl {
    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final EmailServiceImpl emailService;
    private final GhnServiceImpl ghnService;
    private final GhnConfig ghnConfig;
    private final ShopServiceImpl shopService;
    private final ShippingOrderRepository shippingOrderRepository;
    private final ProductRepository productRepository;

    // request sent from Backend Server side -> Vnpay
    public PaymentDto.VnPayResponse createVnPayPayment(HttpServletRequest request) throws ServletException {
//        String userId = request.getParameter("userId");
//
//        List<Order> orders = orderRepository.findPendingOrdersByUserId(Long.valueOf(userId));
        Payment payment = paymentRepository.findByTxnRef(request.getParameter("TxnRef"));
        Map<String, String> vnPayParams = vnPayConfig.getVnPayParams();
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String ipAddr = VnPayUtil.getIpAddress(request);
        String amount1 = String.valueOf(amount);
        vnPayParams.put("vnp_Amount", amount1);
        vnPayParams.put("vnp_IpAddr", ipAddr);
        vnPayParams.put("vnp_TxnRef", payment.getTxnRef());
        String orderInfo = "Thanhtoan" ;
        vnPayParams.put("vnp_OrderInfo", orderInfo);
//        String bankCode = request.getParameter("bankCode");
//        if (bankCode != null && !bankCode.isEmpty()) {
//            vnp_BankCode=VNPAYQR Thanh toán quét mã QR
//            vnp_BankCode=VNBANK Thẻ ATM - Tài khoản ngân hàng nội địa
//            vnp_BankCode=INTCARD Thẻ thanh toán quốc tế
//            vnPayParams.put("vnp_BankCode", bankCode);
//        }

        List fieldNames = new ArrayList(vnPayParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder query = new StringBuilder();
        StringBuilder sb = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = vnPayParams.get(fieldName);
            query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
            query.append("=");
            query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
            sb.append(fieldName);
            sb.append("=");
            sb.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
            if (itr.hasNext()) {
                query.append("&");
                sb.append("&");
            }
        }
        String queryUrl = query.toString();
        String secureHash = VnPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), sb.toString());
        queryUrl += "&vnp_SecureHash=" + secureHash;
        String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
        vnPayParams.forEach((k, v) -> {
            if (v == null) System.out.println("NULL FIELD: " + k);
        });
        return PaymentDto.VnPayResponse.builder().code("00").message("success").paymentUrl(paymentUrl).build();
    }

    // request received from VnPay -> Backend Server
    @Transactional
    public PaymentDto.VnPayResponse processVnpayIpn(HttpServletRequest request) {
        try {

        /*  IPN URL: Record payment results from VNPAY
        Implementation steps:
        Check checksum
        Find transactions (vnp_TxnRef) in the database (checkOrderId)
        Check the payment status of transactions before updating (checkOrderStatus)
        Check the amount (vnp_Amount) of transactions before updating (checkAmount)
        Update results to Database
        Return recorded results to VNPAY
        */

            // ex:  	PaymnentStatus = 0; pending
            //              PaymnentStatus = 1; success
            //              PaymnentStatus = 2; Faile

            //Begin process return from VNPAY
            Map fields = new HashMap();
            for (Enumeration params = request.getParameterNames(); params.hasMoreElements(); ) {
                String fieldName = (String) params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                    fields.put(fieldName, fieldValue);
                }
            }

            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");
            // Check checksum
            String signValue = VnPayUtil.hashAllFields(fields, vnPayConfig.getHashSecret());
            if (!signValue.equals(vnp_SecureHash)) {
                return PaymentDto.VnPayResponse.builder().code("97").message("Invalid checksum").build();
            }
            Payment payment = paymentRepository.findByTxnRefForUpdate(request.getParameter("vnp_TxnRef")).orElseThrow(() -> new ResourceNotFound("Payment not found"));
            // Order order = orderRepository.findById(Long.valueOf(request.getParameter("vnp_TxnRef"))).orElseThrow(() -> new ResourceNotFound("Order not found")); // vnp_TxnRef exists in your database
            BigDecimal vnpAmount = new BigDecimal(request.getParameter("vnp_Amount")).divide(BigDecimal.valueOf(100));
            if (vnpAmount.compareTo(payment.calculateTotalAmount(payment.getOrders())) != 0) // vnp_Amount is valid (Check vnp_Amount VNPAY returns compared to the
            {
                return PaymentDto.VnPayResponse.builder().code("04").message("Invalid Amount").build();
            }

            //amount of the code (vnp_TxnRef) in the  database).
            // PaymentStatus = 0 (pending)
            if (payment.getPaymentStatus() == PaymentStatus.PENDING) {
                if ("00".equals(request.getParameter("vnp_ResponseCode"))) {
                    //Here Code update PaymentStatus = 1 into  Database
                    for(Order order : payment.getOrders()) {
                        order.setOrderStatus(OrderStatus.PAID);
                        orderRepository.save(order);

                        Shop shop = order.getShop();
                        if (!shop.isGhnConnected()) { // ghnconnect = false
                            order.setOrderStatus(OrderStatus.PROCESSING);
                            orderRepository.save(order);
                            continue;
                        }

                        try {
                            GhnDto.GhnCreateOrderRequest req = buildGhnRequest(order);
                            GhnDto.GhnOrderResponse ghnOrderResponse = ghnService.createOrder(shop.getGhnToken(), String.valueOf(shop.getGhnShopId()), req);

                            LocalDateTime time = Instant
                                    .parse(ghnOrderResponse.getData().getExpectedDeliveryTime())
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDateTime();

                            ShippingOrder shippingOrder = ShippingOrder.builder()
                                    .ghnOrderCode(ghnOrderResponse.getData().getOrderCode())
                                    .shippingFee(ghnOrderResponse.getData().getTotalFee())
                                    .expectedDeliveryTime(time)
                                    .createdAt(LocalDateTime.now())
                                    .status(ShippingStatus.CREATED)
                                    .order(order)
                                    .build();

                            shippingOrderRepository.save(shippingOrder);
                            order.setOrderStatus(OrderStatus.SHIPPING);
                            orderRepository.save(order);
                        } catch (Exception e) {
                            log.error("GHN failed for order {}: {}", order.getId(), e.getMessage());
//                            order.setOrderStatus(OrderStatus.CANCELLED);
                            orderRepository.save(order);
                        }
                    };
                    BigDecimal totalAmount = payment.getOrders().stream()
                            .filter(order -> order.getOrderStatus() != OrderStatus.CANCELLED)
                            .map(Order::getTotalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    payment.setPaymentStatus(PaymentStatus.SUCCESS);
                    payment.setTotalAmount(totalAmount);
                    paymentRepository.save(payment);
                    String name = payment.getUser().getFirstName() + payment.getUser().getLastName();
                    emailService.sendOrderEmail(payment.getUser().getEmail(), name, payment.getId(), String.valueOf(payment.getTotalAmount()));
                } else {
                    // Here Code update PaymentStatus = 2 into Database
                    for (Order order : payment.getOrders()) {
                        for (OrderItem orderItem : order.getOrderitems()) {
                            productRepository.restoreInventory(orderItem.getProduct().getId(), orderItem.getQuantity());
                        }
                        order.setOrderStatus(OrderStatus.PAYMENT_FAILED);
                    }
                    payment.setPaymentStatus(PaymentStatus.FAILED);
                }
                paymentRepository.save(payment);
                orderRepository.saveAll(payment.getOrders());
            }
            return PaymentDto.VnPayResponse.builder().code("00").message("Confirm success").build();
        } catch (Exception e) {
            e.printStackTrace();
            return PaymentDto.VnPayResponse.builder().code("99").message("Unknown Error").build();
        }
    }

    private GhnDto.GhnCreateOrderRequest buildGhnRequest(Order order) {
        List<GhnOrderItem> ghnOrderItems = order.getOrderitems()
                .stream()
                .map(item -> GhnOrderItem.builder()
                        .name(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getUnitPrice().intValue())
                        .weight(item.getWeight())
                        .code(String.valueOf(item.getProduct().getId()))
                        .build()).toList();
        Shop shop = order.getShop();
        User user = order.getUser();
        String name = user.getFirstName() + user.getLastName();
//        log.info("ToName: {} ToPhone: {} RequiredNote: {}", name, user.getPhone(), "KHONGCHOXEMHANG");
        return GhnDto.GhnCreateOrderRequest.builder()
                .fromName(shop.getFromName())
                .fromPhone(shop.getFromPhone())
                .fromAddress(shop.getFromAddress())
                .fromWardName(shop.getFromWardName())
                .fromDistrictName(shop.getFromDistrictName())
                .fromProvinceName(shop.getFromProvinceName())
                .paymentTypeId(1)
                .serviceTypeId(2)
                .requiredNote("KHONGCHOXEMHANG")
                .toName(name)
                .toPhone(user.getPhone())
                .toAddress(user.getPlace() != null ? user.getPlace() : "N/A")
                .toWardCode(user.getWardCode())
                .toDistrictId(user.getDistrictId())
                .weight(20).height(20).length(20).width(20)
                .items(ghnOrderItems)
                .build();
    }

    public PaymentDto.VnPayResponse returnUrl(HttpServletRequest request) {
        //Begin process return from VNPAY
        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = (String) params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                fields.put(fieldName, fieldValue);
            }
        }
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        String signValue = VnPayUtil.hashAllFields(fields, vnPayConfig.getHashSecret());
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_ResponseCode"))) {
                return PaymentDto.VnPayResponse.builder().code("00").message("GD Thành công").build();
            } else {
                return PaymentDto.VnPayResponse.builder().code("01").message("GD Không thành công").build();
            }
        } else {
            return PaymentDto.VnPayResponse.builder().code("99").message("Chữ ký không hợp lệ").build();
        }
    }
}