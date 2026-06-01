package com.ecommerce.ecommerce.serviceImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.ecommerce.dao.Cart;
import com.ecommerce.ecommerce.dao.CartItem;
import com.ecommerce.ecommerce.dao.Order;
import com.ecommerce.ecommerce.dao.OrderItem;
import com.ecommerce.ecommerce.dao.Payment;
import com.ecommerce.ecommerce.dao.Product;
import com.ecommerce.ecommerce.dao.Shop;
import com.ecommerce.ecommerce.dao.User;
import com.ecommerce.ecommerce.dto.OrderDto;
import com.ecommerce.ecommerce.exception.BusinessException;
import com.ecommerce.ecommerce.exception.ResourceNotFound;
import com.ecommerce.ecommerce.repository.CartRepository;
import com.ecommerce.ecommerce.repository.OrderItemRepository;
import com.ecommerce.ecommerce.repository.OrderRepository;
import com.ecommerce.ecommerce.repository.PaymentRepository;
import com.ecommerce.ecommerce.repository.ProductRepository;
import com.ecommerce.ecommerce.repository.ShopRepository;
import com.ecommerce.ecommerce.repository.UserRepository;
import com.ecommerce.ecommerce.service.OrderService;
import com.ecommerce.ecommerce.util.MapperUtil;
import com.ecommerce.ecommerce.util.status.OrderStatus;
import com.ecommerce.ecommerce.util.status.PaymentStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartServiceImpl cartService;
    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserServiceImpl userService;
    private final PaymentRepository paymentRepository;

    @Transactional
    @Override
    public List<OrderDto.OrderResponse> createOrderFromCart(Long userId) {
        List<Order> orders = new ArrayList<>();
        Cart cart = cartRepository.findIdByUser_Id(userId).orElseThrow(() -> new ResourceNotFound("Cart not found with user [%s]".formatted(userId)));
        Map<Long, List<CartItem>> itemGroupedByShop = groupCartItemsByShop(cart);
        BigDecimal totalAmount = BigDecimal.ZERO;
        // split specific shop of a particular cart
        for (Long shopId : itemGroupedByShop.keySet()) {
            Shop shop = shopRepository.findById(shopId).orElseThrow(() -> new ResourceNotFound("Shop with id [%s] not found".formatted(shopId)));
            // this order will store all products user buy on a particular shop
            Order order = createOrder(userId, shop);
            orderRepository.save(order);
            List<CartItem> items = itemGroupedByShop.get(shopId);
            for (CartItem item : items) {
                Product product = productRepository.findByIdForUpdate(item.getProduct().getId())
                        .orElseThrow(() -> new ResourceNotFound("Product with id [%s] not found".formatted(item.getProduct().getId())));

                if (product.getInventory() < item.getQuantity()) {
                    throw new BusinessException(HttpStatus.CONFLICT,
                            "Insufficient inventory for product [%s]".formatted(product.getName()));
                }
                product.setInventory(product.getInventory() - item.getQuantity());

                OrderItem orderItem = new OrderItem(
                        item.getQuantity(),
                        item.getUnitPrice(),
                        order, product
                );
                orderItemRepository.save(orderItem);
                productRepository.save(product);
                order.getOrderitems().add(orderItem);
            }
            order.setTotalAmount(getTotalAmountOfEachShop(shop, items));
            totalAmount = totalAmount.add(order.getTotalAmount());
            orders.add(order);
        }
        Payment payment = new Payment();
        payment.setOrders(orders);
//        payment.setTotalAmount(totalAmount);
        payment.setCreateAt(LocalDateTime.now());
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setTxnRef(String.valueOf(System.currentTimeMillis()));
        payment.setUser(userRepository.findById(userId).orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(userId))));
        paymentRepository.save(payment);

        orders.forEach(order -> {
            order.setPayment(payment);
        });
        orderRepository.saveAll(orders);

        cart.getCartItems().clear();
        cartRepository.save(cart);
        return MapperUtil.mapList(orders,OrderDto.OrderResponse.class);
    }

    private Map<Long, List<CartItem>> groupCartItemsByShop(Cart cart) {
        return cart.getCartItems()
                .stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getShop().getId()));
    }

    public Order createOrder(Long userId, Shop shop) {
        Order order = new Order();
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(userId)));
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setUser(user);
        order.setShop(shop);
        return order;
    }

    @Override
    public BigDecimal getTotalAmountOfEachShop(Shop shop, List<CartItem> items) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : items) {
            totalAmount = totalAmount.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return totalAmount;
    }

    @Override
    public OrderDto.OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFound("Order with id [%s] not found".formatted(orderId)));
        if (!order.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have access to this order");
        }
        return MapperUtil.mapObject(order, OrderDto.OrderResponse.class);
    }

    @Override
    public List<OrderDto.OrderResponse> getOrdersByUser(Long userId) {
        // firstly check if user is exist
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFound("User with id [%s] not found".formatted(userId)));
        return MapperUtil.mapList(orderRepository.findByUserId(user.getId()), OrderDto.OrderResponse.class);
    }

    private void checkStatus(Order order, OrderStatus expected) {
        if (order.getOrderStatus() != expected) {
            throw new BusinessException("Invalid order status transition");
        }
    }

    @Transactional
    @Override
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFound("Order not found"));

        // check owner
        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "You cannot cancel this order");
        }

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new BusinessException(HttpStatus.CONFLICT, "Only PENDING orders can be cancelled");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
