package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
            select p from Product p
            where lower(p.name) like lower(concat('%', ?1, '%'))
               or lower(p.description) like lower(concat('%', ?1, '%'))
               or lower(p.categoryName) like lower(concat('%', ?1, '%'))
            """)
    Page<Product> search(String keyword, Pageable pageable);

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
}
