package com.team17.cinema.booking;

import jakarta.persistence.*;

@Entity
@Table(name = "seat")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "showroom_id", nullable = false)
    private Integer showroomId;

    @Column(name = "row_label", nullable = false, length = 1)
    private String rowLabel;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    public Long getId() { return id; }
    public Integer getShowroomId() { return showroomId; }
    public void setShowroomId(Integer showroomId) { this.showroomId = showroomId; }
    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }
    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public String getLabel() { return rowLabel + seatNumber; }
}
