package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CartItemRequest;
import com.ecommerce.backend.dto.CartResponse;
import com.ecommerce.backend.service.CartService;
import com.ecommerce.backend.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getCart(currentUserService.getCurrentUser().getId()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(currentUserService.getCurrentUser().getId(), request));
    }

    @PutMapping("/items")
    public ResponseEntity<CartResponse> updateItem(@Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(currentUserService.getCurrentUser().getId(), request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> deleteItem(@PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeItem(currentUserService.getCurrentUser().getId(), productId));
    }
}
