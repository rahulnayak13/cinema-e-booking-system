package com.team17.cinema.movie;

import com.team17.cinema.showtime.ShowtimeRepository;
import com.team17.cinema.showtime.ShowtimeResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;

    public MovieService(MovieRepository movieRepository, ShowtimeRepository showtimeRepository) {
        this.movieRepository = movieRepository;
        this.showtimeRepository = showtimeRepository;
    }

    public List<Movie> listMovies(MovieStatus status, String q, String genre, String showDate) {
        List<Movie> movies = movieRepository.findAll();

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

            var showtimesOnDate = showtimeRepository.findByStartTimeBetween(startOfDay, endOfDay);
            List<Long> movieIdsWithShowtimes = showtimesOnDate.stream()
                    .map(st -> st.getMovie().getId())
                    .distinct()
                    .toList();

            movies = movies.stream()
                    .filter(m -> movieIdsWithShowtimes.contains(m.getId()))
                    .toList();
        }

        return movies;
    }

    public Movie getMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<ShowtimeResponse> getMovieShowtimes(Long id) {
        return showtimeRepository.findByMovieId(id).stream()
                .map(ShowtimeResponse::new)
                .toList();
    }

    @Transactional
    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setStatus(request.getStatus());
        movie.setRating(request.getRating());
        movie.setDescription(request.getDescription());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        if (request.getGenres() != null) {
            movie.setGenres(request.getGenres());
        }
        return new MovieResponse(movieRepository.save(movie));
    }

    @Transactional
    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
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
        return new MovieResponse(movieRepository.save(movie));
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movieRepository.delete(movie);
    }
}
