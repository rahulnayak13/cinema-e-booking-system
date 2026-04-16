package com.team17.cinema.showtime;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieId(Long movieId);

    List<Showtime> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    
    // Check for scheduling conflicts
    boolean existsByShowroomIdAndStartTime(Integer showroomId, LocalDateTime startTime);
}