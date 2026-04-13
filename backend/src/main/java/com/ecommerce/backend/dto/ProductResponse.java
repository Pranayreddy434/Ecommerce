package com.ecommerce.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private String categoryId;
    private String categoryName;
    private BigDecimal price;
    private Double rating;
    private Integer stock;
    private List<String> imageUrls;
    private boolean featured;
}
