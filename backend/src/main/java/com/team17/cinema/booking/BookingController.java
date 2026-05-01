package com.team17.cinema.booking;

import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.security.TokenProvider;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Thin HTTP adapter: resolves the authenticated user, delegates all domain
 * work to BookingService, and maps domain exceptions to HTTP status codes.
 *
 * Separation of concerns: no booking rules, no email logic, no DTO assembly here.
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);

    private final BookingService bookingService;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService,
                             TokenProvider tokenProvider,
                             UserRepository userRepository) {
        this.bookingService = bookingService;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Long userId = resolveUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        List<BookingHistoryResponse> history = bookingService.getOrderHistory(userId);
        return ResponseEntity.ok(history);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Long userId = resolveUserId(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            Booking saved = bookingService.createBooking(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("bookingId", saved.getId(), "message", "Booking confirmed"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Auth helper (HTTP-layer concern) ────────────────────────────────────

    private Long resolveUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = tokenProvider.getEmailFromToken(token);
                if (email != null) {
                    BaseUser user = userRepository.findByEmail(email).orElse(null);
                    if (user != null) {
                        return user.getId();
                    }
                }
            } catch (Exception ignored) {
                return null;
            }
        }
        return null;
    }
}

