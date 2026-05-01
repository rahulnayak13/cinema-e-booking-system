package com.team17.cinema.booking;

import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.security.TokenProvider;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Facade Pattern — GoF Structural Pattern
 *
 * BookingFacade provides a single, simplified entry point for all booking
 * operations. It hides the complexity of the subsystems involved:
 *
 *   - BookingService  : seat validation, conflict checks, persistence, payment ref
 *   - TokenProvider   : JWT token resolution
 *   - UserRepository  : user lookup by email
 *
 * Controllers talk only to this facade. They do not need to know which
 * subsystem handles which responsibility — the facade coordinates them all.
 *
 * Without the Facade:
 *   BookingController → BookingService + TokenProvider + UserRepository (3 dependencies, mixed concerns)
 *
 * With the Facade:
 *   BookingController → BookingFacade (1 dependency, clean interface)
 */
@Component
public class BookingFacade {

    private final BookingService bookingService;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    public BookingFacade(BookingService bookingService,
                         TokenProvider tokenProvider,
                         UserRepository userRepository) {
        this.bookingService = bookingService;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    /**
     * Resolves the authenticated user from the Authorization header, then
     * creates and persists a new booking. Coordinates token resolution,
     * user lookup, and booking domain logic behind a single call.
     *
     * @throws SecurityException        if the token is missing or invalid
     * @throws IllegalArgumentException if any seat ID is invalid
     * @throws IllegalStateException    if any seat is already booked
     */
    public Booking createBooking(BookingRequest request, String authHeader) {
        Long userId = resolveUserId(authHeader);
        if (userId == null) {
            throw new SecurityException("Authentication required");
        }
        return bookingService.createBooking(request, userId);
    }

    /**
     * Resolves the authenticated user from the Authorization header, then
     * returns their full order history. Coordinates token resolution,
     * user lookup, and history retrieval behind a single call.
     *
     * @throws SecurityException if the token is missing or invalid
     */
    public List<BookingHistoryResponse> getOrderHistory(String authHeader) {
        Long userId = resolveUserId(authHeader);
        if (userId == null) {
            throw new SecurityException("Authentication required");
        }
        return bookingService.getOrderHistory(userId);
    }

    // ─── Private: auth resolution (hidden from callers) ──────────────────────

    private Long resolveUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        try {
            String token = authHeader.substring(7);
            String email = tokenProvider.getEmailFromToken(token);
            if (email == null) return null;
            BaseUser user = userRepository.findByEmail(email).orElse(null);
            return user != null ? user.getId() : null;
        } catch (Exception ignored) {
            return null;
        }
    }
}
