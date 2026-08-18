package com.ecommerce.ecommerce.util.Mapper;

import com.ecommerce.ecommerce.dao.Image;
import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dto.ImageDto;
import com.ecommerce.ecommerce.dto.ProductDto;
import com.ecommerce.ecommerce.dto.SellerDto;
import com.ecommerce.ecommerce.serviceImpl.S3ServiceImpl;
import com.ecommerce.ecommerce.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductMapper {

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

    private SellerDto.OrderResponse toResponse(Order order) {

        return SellerDto.OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .customerPhone(order.getUser().getPhone())
                .createdAt(order.getOrderDate())
                .subtotal(order.getTotalAmount())
                .shippingFee(order.getShippingOrder().getShippingFee() == null ? 0 : order.getShippingOrder().getShippingFee())
                .total(order.getPayment().getTotalAmount())
                .status(order.getOrderStatus())
                .build();
    }
}