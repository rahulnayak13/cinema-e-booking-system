package com.team17.cinema.booking;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class BookingRequest {
    @NotNull(message = "Showtime ID is required")
    private Long showtimeId;

    @NotNull(message = "Seat IDs are required")
    @NotEmpty(message = "At least one seat must be selected")
    private List<Long> seatIds;
    private Map<String, Integer> tickets; // e.g. {"ADULT": 2, "CHILD": 1}
    private BigDecimal totalPrice;

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }
    public List<Long> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }
    public Map<String, Integer> getTickets() { return tickets; }
    public void setTickets(Map<String, Integer> tickets) { this.tickets = tickets; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
