package com.team17.cinema.booking;

import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.security.TokenProvider;
import com.team17.cinema.showtime.Showtime;
import com.team17.cinema.showtime.ShowtimeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    public BookingController(BookingRepository bookingRepository,
                             SeatRepository seatRepository,
                             ShowtimeRepository showtimeRepository,
                             TokenProvider tokenProvider,
                             UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.showtimeRepository = showtimeRepository;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Long userId = resolveUserId(authHeader);
        if (userId == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Authentication required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<BookingHistoryResponse> history = bookings.stream().map(booking -> {
            Showtime showtime = showtimeRepository.findById(booking.getShowtimeId()).orElse(null);
            String movieTitle = (showtime != null && showtime.getMovie() != null)
                    ? showtime.getMovie().getTitle()
                    : "Unknown Movie";
            Integer showroomId = showtime != null ? showtime.getShowroomId() : null;

            return new BookingHistoryResponse(
                    booking.getId(),
                    booking.getShowtimeId(),
                    movieTitle,
                    showroomId,
                    showtime != null ? showtime.getStartTime() : null,
                    booking.getSeats().stream().map(Seat::getLabel).toList(),
                    booking.getTotalPrice(),
                    booking.getCreatedAt());
        }).toList();

        return ResponseEntity.ok(history);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Long userId = resolveUserId(authHeader);

        if (userId == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Authentication required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "One or more invalid seat IDs");
            return ResponseEntity.badRequest().body(err);
        }

        Set<Long> alreadyBooked = bookingRepository.findBookedSeatIdsByShowtimeId(request.getShowtimeId());
        for (Long seatId : request.getSeatIds()) {
            if (alreadyBooked.contains(seatId)) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "One or more selected seats are already booked");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
            }
        }

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setShowtimeId(request.getShowtimeId());
        booking.setTotalPrice(request.getTotalPrice());
        booking.setSeats(seats);

        Booking saved = bookingRepository.save(booking);

        Map<String, Object> response = new HashMap<>();
        response.put("bookingId", saved.getId());
        response.put("message", "Booking confirmed");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

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
