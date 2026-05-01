package com.team17.cinema.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class BookingHistoryResponse {
    private Long bookingId;
    private Long showtimeId;
    private String movieTitle;
    private Integer showroomId;
    private LocalDateTime startTime;
    private List<String> seats;
    private Map<String, Integer> tickets;
    private BigDecimal totalPrice;
    private String paymentReference;
    private LocalDateTime bookedAt;

    public BookingHistoryResponse(
            Long bookingId,
            Long showtimeId,
            String movieTitle,
            Integer showroomId,
            LocalDateTime startTime,
            List<String> seats,
            Map<String, Integer> tickets,
            BigDecimal totalPrice,
            String paymentReference,
            LocalDateTime bookedAt) {
        this.bookingId = bookingId;
        this.showtimeId = showtimeId;
        this.movieTitle = movieTitle;
        this.showroomId = showroomId;
        this.startTime = startTime;
        this.seats = seats;
        this.tickets = tickets;
        this.totalPrice = totalPrice;
        this.paymentReference = paymentReference;
        this.bookedAt = bookedAt;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getShowtimeId() {
        return showtimeId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public Integer getShowroomId() {
        return showroomId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public List<String> getSeats() {
        return seats;
    }

    public Map<String, Integer> getTickets() {
        return tickets;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }
}
