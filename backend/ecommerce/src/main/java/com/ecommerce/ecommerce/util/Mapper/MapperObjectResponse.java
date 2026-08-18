package com.ecommerce.ecommerce.util.Mapper;

import com.ecommerce.ecommerce.dao.Image;
import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dao.OrderItem;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dto.ImageDto;
import com.ecommerce.ecommerce.dto.ProductDto;
import com.ecommerce.ecommerce.dto.SellerDto;
import com.ecommerce.ecommerce.serviceImpl.S3ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class MapperObjectResponse {

    private final S3ServiceImpl s3Service;

    public ProductDto.ProductResponse toResponse(Product product) {

        ProductDto.ProductResponse response =
                MapperUtil.mapObject(product, ProductDto.ProductResponse.class);

        response.setImage(
                product.getImage().stream()
                        .map(this::toImageResponse)
                        .toList()
        );

        return response;
    }

    private ImageDto.ImageResponse toImageResponse(Image image) {

        ImageDto.ImageResponse response = new ImageDto.ImageResponse();

        response.setId(image.getId());
        response.setProductId(image.getProduct().getId());
        response.setImageUrl(s3Service.getFileUrl(image.getImageKey()));

        return response;
    }

    public SellerDto.OrderResponse toOrderResponse(Order order) {

        return SellerDto.OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .customerPhone(order.getUser().getPhone())
                .createdAt(order.getOrderDate())
                .subtotal(order.getTotalAmount())
                .shippingFee(order.getShippingFee())
                .total(order.getTotalAmount().add(BigDecimal.valueOf(order.getShippingFee())))
                .status(order.getOrderStatus())
                .build();
    }

    public SellerDto.OrderDetailResponse toOrderDetailResponse(Order order) {
        return SellerDto.OrderDetailResponse.builder().id(order.getId())
                .createdAt(order.getOrderDate())
                .customerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .customerPhone(order.getUser().getPhone())
                .shippingFee(order.getShippingFee())
                .status(order.getOrderStatus())
                .customerAddress(order.getUser().getPlace())
                .shippingCode(order.getShippingOrder() == null ? null : order.getShippingOrder().getGhnOrderCode())
                .expectedDelivery(order.getShippingOrder() == null ? null : order.getShippingOrder().getExpectedDeliveryTime())
                .subtotal(order.getTotalAmount())
                .total(order.getTotalAmount().add(BigDecimal.valueOf(order.getShippingFee())))
                .items(order.getOrderitems().stream().map(this::toOrderItem).toList())
                .build();
    }

    private SellerDto.OrderDetailResponse.OrderItemResponse toOrderItem(OrderItem orderItem) {
        StringBuilder imageUrl = new StringBuilder();
        for (Image image: orderItem.getProduct().getImage()) {
            imageUrl.append(image.getImageKey());
        }
        return SellerDto.OrderDetailResponse.OrderItemResponse.builder().productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName()).quantity(orderItem.getQuantity())
                .weight(orderItem.getWeight()).image(String.valueOf(imageUrl))
                .unitPrice(orderItem.getUnitPrice()).build();
    }
}