package com.team17.cinema.booking;

import java.util.List;

public class SeatStatusDto {
    private Long id;
    private String rowLabel;
    private Integer seatNumber;
    private String label;
    private boolean booked;

    public SeatStatusDto(Seat seat, boolean booked) {
        this.id = seat.getId();
        this.rowLabel = seat.getRowLabel();
        this.seatNumber = seat.getSeatNumber();
        this.label = seat.getLabel();
        this.booked = booked;
    }

    public Long getId() { return id; }
    public String getRowLabel() { return rowLabel; }
    public Integer getSeatNumber() { return seatNumber; }
    public String getLabel() { return label; }
    public boolean isBooked() { return booked; }
}
