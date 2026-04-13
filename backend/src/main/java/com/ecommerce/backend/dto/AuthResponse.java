package com.ecommerce.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String userId;
    private String fullName;
    private String email;
    private Set<String> roles;
}
