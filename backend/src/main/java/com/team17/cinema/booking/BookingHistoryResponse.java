package com.team17.cinema.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookingHistoryResponse {
    private Long bookingId;
    private Long showtimeId;
    private String movieTitle;
    private Integer showroomId;
    private LocalDateTime startTime;
    private List<String> seats;
    private BigDecimal totalPrice;
    private LocalDateTime bookedAt;

    public BookingHistoryResponse(
            Long bookingId,
            Long showtimeId,
            String movieTitle,
            Integer showroomId,
            LocalDateTime startTime,
            List<String> seats,
            BigDecimal totalPrice,
            LocalDateTime bookedAt) {
        this.bookingId = bookingId;
        this.showtimeId = showtimeId;
        this.movieTitle = movieTitle;
        this.showroomId = showroomId;
        this.startTime = startTime;
        this.seats = seats;
        this.totalPrice = totalPrice;
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

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }
}
