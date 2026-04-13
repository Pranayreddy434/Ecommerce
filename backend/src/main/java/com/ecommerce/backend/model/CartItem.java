package com.ecommerce.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CartItem {
    private Long productId;
    private String productName;
    @Column(length = 1000)
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
}
