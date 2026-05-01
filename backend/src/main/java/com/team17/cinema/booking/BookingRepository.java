package com.team17.cinema.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Set;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings for a given showtime
    List<Booking> findByShowtimeId(Long showtimeId);

    // Find all bookings for a given user, newest first
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Get all booked seat IDs for a showtime
    @Query("SELECT s.id FROM Booking b JOIN b.seats s WHERE b.showtimeId = :showtimeId")
    Set<Long> findBookedSeatIdsByShowtimeId(@Param("showtimeId") Long showtimeId);
}
