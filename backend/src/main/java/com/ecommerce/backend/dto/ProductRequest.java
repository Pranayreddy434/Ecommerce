package com.ecommerce.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String description;
    @NotBlank
    private String categoryId;
    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;
    @NotNull
    private Integer stock;
    private Double rating;
    @NotEmpty
    private List<String> imageUrls;
    private boolean featured;
}
