package com.ecommerce.backend.config;

import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, CategoryRepository categoryRepository, ProductRepository productRepository) {
        return args -> {
            if (!userRepository.existsByEmail("admin@shopverse.com")) {
                userRepository.save(User.builder()
                        .fullName("ShopVerse Admin")
                        .email("admin@shopverse.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .emailVerified(true)
                        .enabled(true)
                        .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_CUSTOMER))
                        .createdAt(Instant.now())
                        .build());
            }

            if (categoryRepository.count() == 0) {
                Category electronics = categoryRepository.save(Category.builder()
                        .name("Electronics")
                        .description("Smart gadgets and high-performance accessories.")
                        .imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9")
                        .createdAt(Instant.now())
                        .build());
                Category fashion = categoryRepository.save(Category.builder()
                        .name("Fashion")
                        .description("Contemporary essentials inspired by premium marketplaces.")
                        .imageUrl("https://images.unsplash.com/photo-1445205170230-053b83016050")
                        .createdAt(Instant.now())
                        .build());
                Category home = categoryRepository.save(Category.builder()
                        .name("Home Living")
                        .description("Thoughtful decor and furniture for stylish spaces.")
                        .imageUrl("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85")
                        .createdAt(Instant.now())
                        .build());

                productRepository.saveAll(List.of(
                        Product.builder()
                                .name("Noise-Cancelling Headphones")
                                .description("Premium over-ear headphones with adaptive noise cancellation.")
                                .categoryId(electronics.getId())
                                .categoryName(electronics.getName())
                                .price(BigDecimal.valueOf(8999))
                                .rating(4.7)
                                .stock(25)
                                .imageUrls(List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e"))
                                .active(true)
                                .featured(true)
                                .createdAt(Instant.now())
                                .updatedAt(Instant.now())
                                .build(),
                        Product.builder()
                                .name("Urban Travel Backpack")
                                .description("Water-resistant carry pack designed for work, commute, and travel.")
                                .categoryId(fashion.getId())
                                .categoryName(fashion.getName())
                                .price(BigDecimal.valueOf(2499))
                                .rating(4.5)
                                .stock(60)
                                .imageUrls(List.of("https://images.unsplash.com/photo-1542291026-7eec264c27ff"))
                                .active(true)
                                .featured(true)
                                .createdAt(Instant.now())
                                .updatedAt(Instant.now())
                                .build(),
                        Product.builder()
                                .name("Designer Floor Lamp")
                                .description("Warm ambient floor lamp with a sculptural silhouette.")
                                .categoryId(home.getId())
                                .categoryName(home.getName())
                                .price(BigDecimal.valueOf(5299))
                                .rating(4.8)
                                .stock(15)
                                .imageUrls(List.of("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"))
                                .active(true)
                                .featured(false)
                                .createdAt(Instant.now())
                                .updatedAt(Instant.now())
                                .build()
                ));
            }
        };
    }
}
