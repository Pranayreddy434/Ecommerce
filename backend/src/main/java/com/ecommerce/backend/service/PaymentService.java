package com.ecommerce.backend.service;

import com.ecommerce.backend.model.PaymentStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    public PaymentResult processPayment(String paymentMethod) {
        return new PaymentResult(
                "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                PaymentStatus.SUCCESS,
                "Mock payment approved using " + paymentMethod
        );
    }

    public record PaymentResult(String reference, PaymentStatus status, String message) {
    }
}
