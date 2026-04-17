package com.team17.cinema.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByShowroomIdOrderByRowLabelAscSeatNumberAsc(Integer showroomId);
}
