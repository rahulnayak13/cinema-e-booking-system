package com.team17.cinema.service;

import com.team17.cinema.dto.PaymentCardDto;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.entity.PaymentCard;
import com.team17.cinema.repository.PaymentCardRepository;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.security.CardEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentCardService {
    
    private final PaymentCardRepository paymentCardRepository;
    private final UserRepository userRepository;
    private final CardEncryptor cardEncryptor;
    
    private static final int MAX_CARDS_PER_USER = 3;
    
    public PaymentCardService(
        PaymentCardRepository paymentCardRepository,
        UserRepository userRepository,
        CardEncryptor cardEncryptor
    ) {
        this.paymentCardRepository = paymentCardRepository;
        this.userRepository = userRepository;
        this.cardEncryptor = cardEncryptor;
    }
    
    @Transactional(readOnly = true)
    public List<PaymentCardDto> getUserPaymentCards(String email) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return paymentCardRepository.findByUserId(user.getId()).stream()
            .map(card -> {
                // Decrypt card number for display (last 4 digits only)
                String decryptedCardNumber = cardEncryptor.decrypt(card.getCardNumber());
                String maskedCardNumber = "****-****-****-" + decryptedCardNumber.substring(Math.max(0, decryptedCardNumber.length() - 4));
                
                return new PaymentCardDto(
                    card.getId(),
                    card.getCardHolderName(),
                    maskedCardNumber,
                    card.getExpiryDate()
                );
            })
            .collect(Collectors.toList());
    }
    
    @Transactional
    public PaymentCardDto addPaymentCard(String email, PaymentCardDto cardDto) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check limit
        int cardCount = paymentCardRepository.countByUserId(user.getId());
        if (cardCount >= MAX_CARDS_PER_USER) {
            throw new RuntimeException("Maximum " + MAX_CARDS_PER_USER + " payment cards allowed per user");
        }
        
        // Validate card number (basic Luhn check)
        if (!isValidCardNumber(cardDto.getCardNumber())) {
            throw new RuntimeException("Invalid card number");
        }
        
        // Encrypt card number before storing
        String encryptedCardNumber = cardEncryptor.encrypt(cardDto.getCardNumber());
        
        PaymentCard paymentCard = new PaymentCard();
        paymentCard.setUser(user);
        paymentCard.setCardNumber(encryptedCardNumber);
        paymentCard.setCardHolderName(cardDto.getCardHolderName());
        paymentCard.setExpiryDate(cardDto.getExpiryDate());
        
        PaymentCard saved = paymentCardRepository.save(paymentCard);
        
        // Return masked card number
        String maskedCardNumber = "****-****-****-" + cardDto.getCardNumber().substring(Math.max(0, cardDto.getCardNumber().length() - 4));
        return new PaymentCardDto(saved.getId(), saved.getCardHolderName(), maskedCardNumber, saved.getExpiryDate());
    }
    
    @Transactional
    public void deletePaymentCard(String email, Integer cardId) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        PaymentCard card = paymentCardRepository.findById(cardId)
            .orElseThrow(() -> new RuntimeException("Payment card not found"));
        
        if (!card.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: card does not belong to this user");
        }
        
        paymentCardRepository.delete(card);
    }
    
    /**
     * Basic Luhn algorithm validation for credit card numbers
     */
    private boolean isValidCardNumber(String cardNumber) {
        // Remove spaces and dashes
        String digits = cardNumber.replaceAll("[^\\d]", "");
        
        // Must be 13-19 digits
        if (digits.length() < 13 || digits.length() > 19) {
            return false;
        }
        
        int sum = 0;
        boolean alternate = false;
        
        for (int i = digits.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(digits.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 == 0;
    }
}
