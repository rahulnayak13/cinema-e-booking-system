package com.team17.cinema.movie;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final MovieRepository repo;

    public MovieController(MovieRepository repo) {
        this.repo = repo;
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
            LocalDate d = LocalDate.parse(showDate.trim()); // YYYY-MM-DD
            movies = movies.stream()
                    .filter(m -> m.getShowDates() != null && m.getShowDates().contains(d))
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