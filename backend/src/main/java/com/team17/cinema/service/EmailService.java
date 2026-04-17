package com.team17.cinema.service;

import com.team17.cinema.entity.BaseUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final String smtpUsername;
    private final String fromAddress;
    private final String frontendBaseUrl;
    
    public EmailService(
        JavaMailSender mailSender,
        @Value("${spring.mail.username}") String smtpUsername,
        @Value("${app.mail.from:swegroup17.100@gmail.com}") String fromAddress,
        @Value("${app.frontend.base-url:http://localhost:5173}") String frontendBaseUrl
    ) {
        this.mailSender = mailSender;
        this.smtpUsername = smtpUsername;
        this.fromAddress = fromAddress;
        this.frontendBaseUrl = frontendBaseUrl;
    }
    
    public void sendVerificationEmail(BaseUser user, String token) {
        try {
            validateMailConfiguration();
            
            String encodedEmail = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8.toString());
            String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8.toString());
            String verificationLink = frontendBaseUrl + "/verify-email?token=" + encodedToken + "&email=" + encodedEmail;
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress); // ✅ CRITICAL: Use verified sender email (swegroup17.100@gmail.com), NOT SMTP username
            message.setTo(user.getEmail());
            message.setSubject("Verify Your Email Address");
            message.setText("Hello " + user.getFirstName() + ",\n\n" +
                "Thank you for registering! Please verify your email by clicking the link below:\n\n" +
                verificationLink + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create this account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Cinema E-Booking System");
            
            mailSender.send(message);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to encode verification email", e);
        }
    }

    public void sendProfileUpdatedEmail(BaseUser user) {
        validateMailConfiguration();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("Your profile information was updated");
        message.setText("Hello " + user.getFirstName() + ",\n\n"
            + "This is a confirmation that your personal profile information was updated in the Cinema E-Booking System.\n\n"
            + "If you made this change, no further action is required.\n"
            + "If you did not make this change, please reset your password immediately.\n\n"
            + "Best regards,\n"
            + "Cinema E-Booking System");

        mailSender.send(message);
    }

    public void sendPromotionEmail(BaseUser user, com.team17.cinema.promotion.Promotion promotion) {
        validateMailConfiguration();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("New Promotion: " + promotion.getTitle());
        message.setText("Hello " + user.getFirstName() + ",\n\n"
            + "We have a new promotion for you!\n\n"
            + promotion.getTitle() + "\n"
            + (promotion.getDescription() != null ? promotion.getDescription() + "\n\n" : "\n")
            + "Discount: " + promotion.getDiscountPercent() + "%\n"
            + "Valid: " + promotion.getStartDate() + " to " + promotion.getEndDate() + "\n\n"
            + "Best regards,\n"
            + "Cinema E-Booking System");

        mailSender.send(message);
    }

    private void validateMailConfiguration() {
        if (smtpUsername == null || smtpUsername.isBlank()) {
            throw new RuntimeException("SMTP username is not configured (spring.mail.username)");
        }
        if (fromAddress == null || fromAddress.isBlank()) {
            throw new RuntimeException("Mail from address is not configured (app.mail.from)");
        }
    }
}
