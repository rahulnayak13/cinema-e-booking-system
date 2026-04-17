package com.team17.cinema.movie;

import com.team17.cinema.showtime.ShowtimeResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> listMovies(
            @RequestParam(required = false) MovieStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String showDate
    ) {
        return movieService.listMovies(status, q, genre, showDate);
    }

    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable Long id) {
        return movieService.getMovie(id);
    }

    @GetMapping("/{id}/showtimes")
    public List<ShowtimeResponse> getMovieShowtimes(@PathVariable Long id) {
        return movieService.getMovieShowtimes(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public MovieResponse createMovie(@Valid @RequestBody MovieRequest request) {
        return movieService.createMovie(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MovieResponse updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        return movieService.updateMovie(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
    }
}