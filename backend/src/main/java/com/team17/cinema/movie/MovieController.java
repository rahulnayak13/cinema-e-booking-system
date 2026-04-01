package com.team17.cinema.movie;

import org.springframework.web.bind.annotation.*;

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
}