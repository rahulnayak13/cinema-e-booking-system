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

    private static final String SIGNATURE = "\n\nBest regards,\nCinema E-Booking System";

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

    // ─── Public send methods ──────────────────────────────────────────────────

    public void sendVerificationEmail(BaseUser user, String token) {
        try {
            String encodedEmail = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8.toString());
            String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8.toString());
            String link = frontendBaseUrl + "/verify-email?token=" + encodedToken + "&email=" + encodedEmail;

            String body = "Hello " + user.getFirstName() + ",\n\n"
                + "Thank you for registering! Please verify your email by clicking the link below:\n\n"
                + link + "\n\n"
                + "This link will expire in 24 hours.\n\n"
                + "If you didn't create this account, please ignore this email.";

            mailSender.send(buildMessage(user, "Verify Your Email Address", body));
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to encode verification email", e);
        }
    }

    public void sendProfileUpdatedEmail(BaseUser user) {
        String body = "Hello " + user.getFirstName() + ",\n\n"
            + "This is a confirmation that your personal profile information was updated "
            + "in the Cinema E-Booking System.\n\n"
            + "If you made this change, no further action is required.\n"
            + "If you did not make this change, please reset your password immediately.";

        mailSender.send(buildMessage(user, "Your profile information was updated", body));
    }

    public void sendPromotionEmail(BaseUser user, com.team17.cinema.promotion.Promotion promotion) {
        String body = "Hello " + user.getFirstName() + ",\n\n"
            + "We have a new promotion for you!\n\n"
            + promotion.getTitle() + "\n"
            + (promotion.getDescription() != null ? promotion.getDescription() + "\n\n" : "\n")
            + "Discount: " + promotion.getDiscountPercent() + "%\n"
            + "Valid: " + promotion.getStartDate() + " to " + promotion.getEndDate();

        mailSender.send(buildMessage(user, "New Promotion: " + promotion.getTitle(), body));
    }

    public void sendBookingConfirmationEmail(
            BaseUser user,
            long bookingId,
            String movieTitle,
            String showtimeLabel,
            String seats,
            String totalPrice) {

        String body = "Hello " + user.getFirstName() + ",\n\n"
            + "Your booking has been confirmed! Here are your details:\n\n"
            + "  Booking ID : #" + bookingId + "\n"
            + "  Movie      : " + movieTitle + "\n"
            + "  Showtime   : " + showtimeLabel + "\n"
            + "  Seats      : " + seats + "\n"
            + "  Total Paid : " + totalPrice + "\n\n"
            + "Enjoy the show!";

        mailSender.send(buildMessage(user, "Booking Confirmed \u2013 " + movieTitle, body));
    }

    // ─── Infrastructure helpers ───────────────────────────────────────────────

    /**
     * Single place that validates config, sets envelope fields, and appends the
     * standard signature — keeping every public send method free of boilerplate.
     */
    private SimpleMailMessage buildMessage(BaseUser user, String subject, String body) {
        validateMailConfiguration();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(body + SIGNATURE);
        return message;
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
