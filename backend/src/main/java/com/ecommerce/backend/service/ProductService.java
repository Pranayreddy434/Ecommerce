package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.PagedResponse;
import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public PagedResponse<ProductResponse> getProducts(String search, String categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> result;

        if (search != null && !search.isBlank()) {
            result = productRepository.search(search, pageable);
        } else if (categoryId != null && !categoryId.isBlank()) {
            result = productRepository.findByCategoryId(parseId(categoryId), pageable);
        } else {
            result = productRepository.findAll(pageable);
        }

        return PagedResponse.<ProductResponse>builder()
                .content(result.getContent().stream().map(this::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    public ProductResponse getById(String id) {
        return toResponse(findEntity(id));
    }

    public ProductResponse create(ProductRequest request) {
        Category category = categoryService.getEntity(request.getCategoryId());
        Product product = productRepository.save(Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .categoryId(category.getId())
                .categoryName(category.getName())
                .price(request.getPrice())
                .rating(request.getRating() == null ? 4.6 : request.getRating())
                .stock(request.getStock())
                .imageUrls(request.getImageUrls())
                .active(true)
                .featured(request.isFeatured())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());
        return toResponse(product);
    }

    public ProductResponse update(String id, ProductRequest request) {
        Product product = findEntity(id);
        Category category = categoryService.getEntity(request.getCategoryId());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategoryId(category.getId());
        product.setCategoryName(category.getName());
        product.setPrice(request.getPrice());
        product.setRating(request.getRating());
        product.setStock(request.getStock());
        product.setImageUrls(request.getImageUrls());
        product.setFeatured(request.isFeatured());
        product.setUpdatedAt(Instant.now());
        return toResponse(productRepository.save(product));
    }

    public void delete(String id) {
        productRepository.deleteById(parseId(id));
    }

    public Product findEntity(String id) {
        return productRepository.findById(parseId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(String.valueOf(product.getId()))
                .name(product.getName())
                .description(product.getDescription())
                .categoryId(String.valueOf(product.getCategoryId()))
                .categoryName(product.getCategoryName())
                .price(product.getPrice())
                .rating(product.getRating())
                .stock(product.getStock())
                .imageUrls(product.getImageUrls())
                .featured(product.isFeatured())
                .build();
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException ex) {
            throw new ResourceNotFoundException("Invalid product or category id");
        }
    }
}
