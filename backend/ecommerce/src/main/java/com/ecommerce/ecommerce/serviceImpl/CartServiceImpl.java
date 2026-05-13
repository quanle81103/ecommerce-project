package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Cart;
import com.ecommerce.ecommerce.dao.CartItem;
import com.ecommerce.ecommerce.dto.CartDto;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.CartRepository;
import com.ecommerce.ecommerce.service.CartService;
import com.ecommerce.ecommerce.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    @Override
    public CartDto.CartResponse getCartByUserId(Long userId) {
        Cart cart = findCartByUserId(userId);
        cart.setTotalAmount(cart.getTotalAmount());
        return MapperUtil.mapObject(cartRepository.save(cart), CartDto.CartResponse.class);
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
}
