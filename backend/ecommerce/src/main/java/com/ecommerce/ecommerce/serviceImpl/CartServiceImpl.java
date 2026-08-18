package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Cart;
import com.ecommerce.ecommerce.dao.CartItem;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dto.CartDto;
import com.ecommerce.ecommerce.dto.CartItemDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.CartItemRepository;
import com.ecommerce.ecommerce.repository.CartRepository;
import com.ecommerce.ecommerce.service.CartService;
import com.ecommerce.ecommerce.util.Mapper.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final S3ServiceImpl s3Service;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartDto.CartResponse getCartByUserId(Long userId) {
        Cart cart = findCartByUserId(userId);
        BigDecimal totalAmount = getTotalPrice(userId);
        cart.setTotalAmount(totalAmount);

        Cart savedCart = cartRepository.save(cart);
        CartDto.CartResponse response =
                MapperUtil.mapObject(savedCart, CartDto.CartResponse.class);

        response.setTotalAmount(totalAmount);
        response.setCartItems(savedCart.getCartItems().stream().map(this::toCartItemResponse).toList());
        return response;
    }

    @Override
    public BigDecimal getTotalPrice(Long userId) {
        Cart cart = findCartByUserId(userId);
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem item : cart.getCartItems()) {
            totalPrice = totalPrice.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return totalPrice;
    }

    public Cart findCartByUserId(Long userId) {
        return cartRepository.findIdByUser_Id(userId)
                .orElseThrow(() -> new ResourceNotFound("Cart not found for user [%s]".formatted(userId)));
    }

    private CartItemDto.CartItemResponse toCartItemResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();

        CartItemDto.CartItemResponse res = new CartItemDto.CartItemResponse();

        res.setId(cartItem.getId());
        res.setQuantity(cartItem.getQuantity());
        res.setUnitPrice(cartItem.getUnitPrice());
        res.setProductId(product.getId());
        res.setProductName(product.getName());
        res.setShopId(cartItem.getProduct().getShop().getId());
        if (!product.getImage().isEmpty()) {
            res.setProductUrl(s3Service.getFileUrl(product.getImage().getFirst().getImageKey()));
        }

        return res;
    }
}
