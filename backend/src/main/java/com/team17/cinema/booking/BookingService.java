package com.team17.cinema.booking;

import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.service.EmailService;
import com.team17.cinema.showtime.Showtime;
import com.team17.cinema.showtime.ShowtimeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

/**
 * Owns all booking domain logic: seat validation, conflict checking, persistence,
 * history retrieval, and triggering the post-booking notification.
 *
 * Separation of concerns: this class knows nothing about HTTP; BookingController
 * knows nothing about domain rules or email assembly.
 */
@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository,
                          SeatRepository seatRepository,
                          ShowtimeRepository showtimeRepository,
                          UserRepository userRepository,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.showtimeRepository = showtimeRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // ─── Public API ───────────────────────────────────────────────────────────

    /**
     * Validates seats, checks for conflicts, persists the booking, and fires a
     * best-effort confirmation email.
     *
     * @throws IllegalArgumentException if any seat ID is invalid
     * @throws IllegalStateException    if any seat is already booked
     */
    public Booking createBooking(BookingRequest request, Long userId) {
        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new IllegalArgumentException("One or more invalid seat IDs");
        }

        Set<Long> alreadyBooked = bookingRepository.findBookedSeatIdsByShowtimeId(request.getShowtimeId());
        for (Long seatId : request.getSeatIds()) {
            if (alreadyBooked.contains(seatId)) {
                throw new IllegalStateException("One or more selected seats are already booked");
            }
        }

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setShowtimeId(request.getShowtimeId());
        booking.setTotalPrice(request.getTotalPrice());
        booking.setSeats(seats);

        Booking saved = bookingRepository.save(booking);
        sendConfirmationEmail(saved, userId);
        return saved;
    }

    /** Returns all bookings for the given user, newest first. */
    public List<BookingHistoryResponse> getOrderHistory(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    /** Maps a Booking entity to the API response DTO, enriched with showtime/movie data. */
    private BookingHistoryResponse toHistoryResponse(Booking booking) {
        Showtime showtime = showtimeRepository.findById(booking.getShowtimeId()).orElse(null);
        String movieTitle = (showtime != null && showtime.getMovie() != null)
                ? showtime.getMovie().getTitle() : "Unknown Movie";
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
    }

    /**
     * Assembles notification context from domain objects and delegates to
     * EmailService. Never throws — a mail failure must not roll back a saved booking.
     */
    private void sendConfirmationEmail(Booking saved, Long userId) {
        try {
            BaseUser user = userRepository.findById(userId).orElse(null);
            if (user == null) return;

            Showtime showtime = showtimeRepository.findById(saved.getShowtimeId()).orElse(null);
            String movieTitle = (showtime != null && showtime.getMovie() != null)
                    ? showtime.getMovie().getTitle() : "Unknown Movie";
            String showtimeLabel = showtime != null ? showtime.getStartTime().toString() : "N/A";
            String seatLabels = saved.getSeats().stream()
                    .map(Seat::getLabel).reduce((a, b) -> a + ", " + b).orElse("N/A");
            String totalPrice = saved.getTotalPrice() != null
                    ? "$" + saved.getTotalPrice().toPlainString() : "N/A";

            emailService.sendBookingConfirmationEmail(
                    user, saved.getId(), movieTitle, showtimeLabel, seatLabels, totalPrice);
        } catch (Exception e) {
            log.warn("Booking confirmation email failed for booking #{}: {}", saved.getId(), e.getMessage());
        }
    }
}
