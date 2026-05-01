package com.team17.cinema.booking;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Thin HTTP adapter — maps HTTP requests to BookingFacade calls and translates
 * domain exceptions to appropriate HTTP status codes.
 *
 * Uses the Facade Pattern: all booking subsystems (BookingService, TokenProvider,
 * UserRepository) are hidden behind BookingFacade. This controller has exactly
 * one dependency and zero knowledge of booking internals.
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingFacade bookingFacade;

    public BookingController(BookingFacade bookingFacade) {
        this.bookingFacade = bookingFacade;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            List<BookingHistoryResponse> history = bookingFacade.getOrderHistory(authHeader);
            return ResponseEntity.ok(history);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            Booking saved = bookingFacade.createBooking(request, authHeader);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("bookingId", saved.getId(), "message", "Booking confirmed"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

