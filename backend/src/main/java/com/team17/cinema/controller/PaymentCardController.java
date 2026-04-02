package com.team17.cinema.controller;

import com.team17.cinema.dto.PaymentCardDto;
import com.team17.cinema.service.PaymentCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-cards")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PaymentCardController {
    
    private final PaymentCardService paymentCardService;
    
    public PaymentCardController(PaymentCardService paymentCardService) {
        this.paymentCardService = paymentCardService;
    }
    
    @GetMapping
    public ResponseEntity<?> getUserPaymentCards(Authentication authentication) {
        String email = authentication.getName();
        List<PaymentCardDto> cards = paymentCardService.getUserPaymentCards(email);
        return ResponseEntity.ok(cards);
    }
    
    @PostMapping
    public ResponseEntity<?> addPaymentCard(Authentication authentication, @RequestBody PaymentCardDto cardDto) {
        try {
            String email = authentication.getName();
            PaymentCardDto saved = paymentCardService.addPaymentCard(email, cardDto);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{cardId}")
    public ResponseEntity<?> deletePaymentCard(Authentication authentication, @PathVariable Integer cardId) {
        try {
            String email = authentication.getName();
            paymentCardService.deletePaymentCard(email, cardId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Payment card deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
