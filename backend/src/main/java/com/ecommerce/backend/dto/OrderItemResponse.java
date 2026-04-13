package com.ecommerce.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {
    private String productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
}
