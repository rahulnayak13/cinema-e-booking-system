package com.team17.cinema.showtime;

import com.team17.cinema.movie.Movie;
import com.team17.cinema.movie.MovieRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/showtimes")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;

    public ShowtimeController(ShowtimeRepository showtimeRepository, MovieRepository movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }

    // GET all showtimes (for admin viewing)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ShowtimeResponse> getAllShowtimes() {
        return showtimeRepository.findAll().stream()
                .map(ShowtimeResponse::new)
                .collect(Collectors.toList());
    }

    // GET showtimes for a specific movie
    @GetMapping("/movie/{movieId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ShowtimeResponse> getShowtimesByMovie(@PathVariable Long movieId) {
        return showtimeRepository.findByMovieId(movieId).stream()
                .map(ShowtimeResponse::new)
                .collect(Collectors.toList());
    }

    // POST - Add new showtime (Admin only)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addShowtime(@Valid @RequestBody ShowtimeRequest request) {
        
        // 1. Check if movie exists
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + request.getMovieId()));
        
        // 2. Check for scheduling conflict (same showroom, same time)
        boolean conflict = showtimeRepository.existsByShowroomIdAndStartTime(
                request.getShowroomId(), 
                request.getStartTime()
        );
        
        if (conflict) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Scheduling conflict! Showroom " + request.getShowroomId() + 
                      " is already booked at " + request.getStartTime());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
        
        // 3. Create and save showtime
        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setShowroomId(request.getShowroomId());
        showtime.setStartTime(request.getStartTime());
        
        Showtime saved = showtimeRepository.save(showtime);
        
        return ResponseEntity.ok(new ShowtimeResponse(saved));
    }

    // DELETE showtime (Admin only)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteShowtime(@PathVariable Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        showtimeRepository.delete(showtime);
    }
}