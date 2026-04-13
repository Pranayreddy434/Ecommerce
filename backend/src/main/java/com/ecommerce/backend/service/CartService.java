package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CartItemRequest;
import com.ecommerce.backend.dto.CartItemResponse;
import com.ecommerce.backend.dto.CartResponse;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.model.Cart;
import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductService productService;

    public CartResponse getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(userId).items(new ArrayList<>()).updatedAt(Instant.now()).build()));
        return toResponse(cart);
    }

    public CartResponse addToCart(Long userId, CartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId).orElse(Cart.builder().userId(userId).items(new ArrayList<>()).build());
        Product product = productService.findEntity(request.getProductId());
        Long requestedProductId = Long.parseLong(request.getProductId());
        Optional<CartItem> existing = cart.getItems().stream().filter(item -> item.getProductId().equals(requestedProductId)).findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            cart.getItems().add(CartItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .imageUrl(product.getImageUrls().isEmpty() ? "" : product.getImageUrls().get(0))
                    .price(product.getPrice())
                    .quantity(request.getQuantity())
                    .build());
        }

        recalculate(cart);
        return toResponse(cartRepository.save(cart));
    }

    public CartResponse updateItem(Long userId, CartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        Long requestedProductId = Long.parseLong(request.getProductId());
        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.getProductId().equals(requestedProductId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setQuantity(request.getQuantity());
        recalculate(cart);
        return toResponse(cartRepository.save(cart));
    }

    public CartResponse removeItem(Long userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        Long parsedProductId = Long.parseLong(productId);
        cart.getItems().removeIf(item -> item.getProductId().equals(parsedProductId));
        recalculate(cart);
        return toResponse(cartRepository.save(cart));
    }

    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.setItems(new ArrayList<>());
            recalculate(cart);
            cartRepository.save(cart);
        });
    }

    private void recalculate(Cart cart) {
        cart.setTotalAmount(cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        cart.setUpdatedAt(Instant.now());
    }

    private CartResponse toResponse(Cart cart) {
        return CartResponse.builder()
                .id(String.valueOf(cart.getId()))
                .userId(String.valueOf(cart.getUserId()))
                .items(cart.getItems().stream().map(item -> CartItemResponse.builder()
                        .productId(String.valueOf(item.getProductId()))
                        .productName(item.getProductName())
                        .imageUrl(item.getImageUrl())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build()).toList())
                .totalAmount(cart.getTotalAmount())
                .build();
    }
}
