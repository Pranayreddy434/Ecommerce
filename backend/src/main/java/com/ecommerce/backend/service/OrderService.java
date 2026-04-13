package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CheckoutRequest;
import com.ecommerce.backend.dto.OrderItemResponse;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.OrderItem;
import com.ecommerce.backend.model.OrderStatus;
import com.ecommerce.backend.model.PaymentStatus;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(99);

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final PaymentService paymentService;

    public OrderResponse checkout(Long userId, CheckoutRequest request) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new BadRequestException("Cart is empty"));
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("User not found"));
        PaymentService.PaymentResult paymentResult = paymentService.processPayment(request.getPaymentMethod());

        Order order = orderRepository.save(Order.builder()
                .userId(userId)
                .customerName(user.getFullName())
                .customerEmail(user.getEmail())
                .shippingAddress(request.getShippingAddress())
                .items(cart.getItems().stream().map(item -> OrderItem.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .imageUrl(item.getImageUrl())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build()).toList())
                .subtotal(cart.getTotalAmount())
                .shippingFee(SHIPPING_FEE)
                .totalAmount(cart.getTotalAmount().add(SHIPPING_FEE))
                .paymentStatus(paymentResult.status())
                .orderStatus(paymentResult.status() == PaymentStatus.SUCCESS ? OrderStatus.CONFIRMED : OrderStatus.PENDING)
                .paymentReference(paymentResult.reference())
                .createdAt(Instant.now())
                .build());

        cartService.clearCart(userId);
        return toResponse(order);
    }

    public List<OrderResponse> getOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(String.valueOf(order.getId()))
                .shippingAddress(order.getShippingAddress())
                .orderStatus(order.getOrderStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .paymentReference(order.getPaymentReference())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream().map(item -> OrderItemResponse.builder()
                        .productId(String.valueOf(item.getProductId()))
                        .productName(item.getProductName())
                        .imageUrl(item.getImageUrl())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build()).toList())
                .build();
    }
}
