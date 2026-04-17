package com.team17.cinema.movie;

import com.team17.cinema.showtime.ShowtimeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final MovieRepository repo;
    private final ShowtimeRepository showtimeRepo;

    public MovieController(MovieRepository repo, ShowtimeRepository showtimeRepo) {
        this.repo = repo;
        this.showtimeRepo = showtimeRepo;
    }

    // GET /api/movies?status=&q=&genre=&showDate=
    @GetMapping
    public List<Movie> listMovies(
            @RequestParam(required = false) MovieStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String showDate
            
    ) {
        
        List<Movie> movies = repo.findAll();

        if (status != null) {
            movies = movies.stream().filter(m -> m.getStatus() == status).toList();
        }

        if (q != null && !q.trim().isEmpty()) {
            String needle = q.trim().toLowerCase();
            movies = movies.stream()
                    .filter(m -> m.getTitle() != null && m.getTitle().toLowerCase().contains(needle))
                    .toList();
        }

        if (genre != null && !genre.trim().isEmpty()) {
            String g = genre.trim().toLowerCase();
            movies = movies.stream()
                    .filter(m -> m.getGenres() != null && m.getGenres().stream().anyMatch(x -> x.toLowerCase().equals(g)))
                    .toList();
        }

        if (showDate != null && !showDate.trim().isEmpty()) {
            LocalDate targetDate = LocalDate.parse(showDate.trim());
            LocalDateTime startOfDay = targetDate.atStartOfDay();
            LocalDateTime endOfDay = targetDate.plusDays(1).atStartOfDay();
            
            // Get all showtimes on the specified date
            var showtimesOnDate = showtimeRepo.findByStartTimeBetween(startOfDay, endOfDay);
            
            // Extract unique movie IDs from those showtimes
            List<Long> movieIdsWithShowtimes = showtimesOnDate.stream()
                    .map(st -> st.getMovie().getId())
                    .distinct()
                    .toList();
            
            // Filter movies to only those with showtimes on the date
            movies = movies.stream()
                    .filter(m -> movieIdsWithShowtimes.contains(m.getId()))
                    .toList();
        }

        return movies;
    }

    // GET /api/movies/{id}
    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    // POST /api/movies - Admin only - Create new movie
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public MovieResponse createMovie(@Valid @RequestBody MovieRequest request) {
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setStatus(request.getStatus());
        movie.setRating(request.getRating());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        
        // Handle genres
        if (request.getGenres() != null) {
            movie.setGenres(request.getGenres());
        }
        
        Movie saved = repo.save(movie);
        return new MovieResponse(saved);
    }

    // PUT /api/movies/{id} - Admin only - Update existing movie
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MovieResponse updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        Movie movie = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        movie.setTitle(request.getTitle());
        movie.setStatus(request.getStatus());
        movie.setRating(request.getRating());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        
        if (request.getGenres() != null) {
            movie.setGenres(request.getGenres());
        }
        
        Movie saved = repo.save(movie);
        return new MovieResponse(saved);
    }

    // DELETE /api/movies/{id} - Admin only - Delete movie
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMovie(@PathVariable Long id) {
        Movie movie = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Movie not found"));
        repo.delete(movie);
    }
}