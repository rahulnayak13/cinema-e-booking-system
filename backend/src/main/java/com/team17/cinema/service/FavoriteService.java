package com.team17.cinema.service;

import com.team17.cinema.dto.FavoriteMovieDto;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.movie.Movie;
import com.team17.cinema.movie.MovieRepository;
import com.team17.cinema.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    
    public FavoriteService(UserRepository userRepository, MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }
    
    @Transactional(readOnly = true)
    public List<FavoriteMovieDto> getUserFavorites(String email) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getFavoriteMovies().stream()
            .map(movie -> new FavoriteMovieDto(
                movie.getId(),
                movie.getTitle(),
                movie.getPosterUrl(),
                movie.getRating(),
                movie.getDescription()
            ))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void addFavorite(String email, Long movieId) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        if (!user.getFavoriteMovies().contains(movie)) {
            user.getFavoriteMovies().add(movie);
            userRepository.save(user);
        }
    }
    
    @Transactional
    public void removeFavorite(String email, Long movieId) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));
        
        user.getFavoriteMovies().remove(movie);
        userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public boolean isFavorite(String email, Long movieId) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getFavoriteMovies().stream()
            .anyMatch(movie -> movie.getId().equals(movieId));
    }
}
