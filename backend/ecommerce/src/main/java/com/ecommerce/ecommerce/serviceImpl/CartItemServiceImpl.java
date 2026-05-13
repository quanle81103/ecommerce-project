package com.ecommerce.ecommerce.serviceImpl;

import com.ecommerce.ecommerce.dao.Cart;
import com.ecommerce.ecommerce.dao.CartItem;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.CartItemRepository;
import com.ecommerce.ecommerce.repository.CartRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartServiceImpl cartService;

    @Override
    public void addItemToCart(Long userId, Long productId, int quantity) {
        Cart cart = cartService.findCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFound("Product with id [%s] not found".formatted(productId)));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst().orElse(null);

        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setCart(cart);
            cartItem.setUnitPrice(product.getPrice());
            cartItem.setQuantity(quantity);
            cart.addCartItem(cartItem);
        }

        cartRepository.save(cart);
    }

    @Override
    public void removeItemFromCart(Long userId, Long productId) {
        Cart cart = cartService.findCartByUserId(userId);
        CartItem item = findItem(cart, productId);
        cart.deleteCartItem(item);
        cartRepository.save(cart);
        cartItemRepository.delete(item);
    }

    @Override
    public void updateItemQuantity(Long userId, Long productId, int quantity) {
        Cart cart = cartService.findCartByUserId(userId);
        CartItem item = findItem(cart, productId);
        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

    private CartItem findItem(Cart cart, Long productId) {
        return cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFound("Product [%s] not in cart".formatted(productId)));
    }
}
