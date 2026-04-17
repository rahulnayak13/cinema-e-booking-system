package com.team17.cinema.booking;

import com.team17.cinema.showtime.Showtime;
import com.team17.cinema.showtime.ShowtimeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:5173")
public class SeatController {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    public SeatController(ShowtimeRepository showtimeRepository,
                          SeatRepository seatRepository,
                          BookingRepository bookingRepository) {
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.bookingRepository = bookingRepository;
    }

    // GET /api/showtimes/{showtimeId}/seats - public endpoint
    @GetMapping("/{showtimeId}/seats")
    public ResponseEntity<?> getSeatsByShowtime(@PathVariable Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId).orElse(null);
        if (showtime == null) {
            return ResponseEntity.notFound().build();
        }

        Set<Long> bookedSeatIds = bookingRepository.findBookedSeatIdsByShowtimeId(showtimeId);
        List<SeatStatusDto> seats = seatRepository
            .findByShowroomIdOrderByRowLabelAscSeatNumberAsc(showtime.getShowroomId())
            .stream()
            .map(seat -> new SeatStatusDto(seat, bookedSeatIds.contains(seat.getId())))
            .collect(Collectors.toList());

        return ResponseEntity.ok(seats);
    }
}
