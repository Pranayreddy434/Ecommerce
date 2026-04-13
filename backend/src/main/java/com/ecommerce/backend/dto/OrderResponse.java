package com.ecommerce.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private String id;
    private String shippingAddress;
    private String orderStatus;
    private String paymentStatus;
    private String paymentReference;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
    private Instant createdAt;
}
