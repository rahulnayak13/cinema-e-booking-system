package com.team17.cinema.recommendation;

import com.team17.cinema.dto.FavoriteMovieDto;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.movie.Movie;
import com.team17.cinema.movie.MovieRepository;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.service.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    
    private final MovieRepository movieRepository;
    private final FavoriteService favoriteService;
    private final UserRepository userRepository;
    
    // AI Scoring Weights
    private static final double GENRE_MATCH_WEIGHT = 0.55;
    private static final double POPULARITY_WEIGHT = 0.30;
    private static final double RATING_WEIGHT = 0.15;
    
    public RecommendationServiceImpl(MovieRepository movieRepository,
                                     FavoriteService favoriteService,
                                     UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.favoriteService = favoriteService;
        this.userRepository = userRepository;
    }
    
    @Override
    public List<RecommendationResponse.RecommendedMovie> getRecommendationsForUser(String email, int limit) {
        try {
            // Get user's favorite movies
            List<FavoriteMovieDto> userFavorites = favoriteService.getUserFavorites(email);
            
            if (userFavorites.isEmpty()) {
                // No favorites - use popular movies
                return getPopularMovies(limit);
            }
            
            // Extract user's preferred genres from favorites
            Map<String, Integer> genrePreferences = calculateGenrePreferences(userFavorites);
            
            // Get user's favorite movie IDs to exclude
            Set<Long> favoriteIds = userFavorites.stream()
                .map(FavoriteMovieDto::getId)
                .collect(Collectors.toSet());
            
            // Calculate AI scores for all movies
            List<Movie> allMovies = movieRepository.findAll();
            
            return allMovies.stream()
                .filter(movie -> !favoriteIds.contains(movie.getId())) // Exclude already favorited
                .map(movie -> {
                    double score = calculateMovieScore(movie, genrePreferences);
                    return new RecommendationResponse.RecommendedMovie(movie, score);
                })
                .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
                .limit(limit)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            System.err.println("Error getting recommendations for user: " + e.getMessage());
            return getPopularMovies(limit);
        }
    }
    
    @Override
    public List<RecommendationResponse.RecommendedMovie> getGenreBasedRecommendations(String preferredGenre, int limit) {
        List<Movie> allMovies = movieRepository.findAll();
        
        return allMovies.stream()
            .map(movie -> {
                double score = calculateGenreScore(movie, preferredGenre);
                return new RecommendationResponse.RecommendedMovie(movie, score);
            })
            .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<RecommendationResponse.RecommendedMovie> getPopularMovies(int limit) {
        List<Movie> allMovies = movieRepository.findAll();
        
        return allMovies.stream()
            .map(movie -> new RecommendationResponse.RecommendedMovie(movie, 
                calculatePopularityScore(movie)))
            .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    // ========== AI SCORING ALGORITHMS ==========
    
    /**
     * AI-powered score calculation using multiple signals
     */
    private double calculateMovieScore(Movie movie, Map<String, Integer> genrePreferences) {
        double genreScore = calculateGenrePreferenceScore(movie, genrePreferences);
        double popularityScore = calculatePopularityScore(movie);
        double ratingScore = calculateRatingScore(movie);
        
        // Weighted average combining all AI signals
        return (genreScore * GENRE_MATCH_WEIGHT) +
               (popularityScore * POPULARITY_WEIGHT) +
               (ratingScore * RATING_WEIGHT);
    }
    
    /**
     * Calculates how well movie genres match user preferences (AI: pattern recognition)
     */
    private double calculateGenrePreferenceScore(Movie movie, Map<String, Integer> genrePreferences) {
        if (genrePreferences.isEmpty()) return 0.5;
        
        double totalScore = 0.0;
        int totalGenres = movie.getGenres().size();
        
        for (String genre : movie.getGenres()) {
            Integer preferenceWeight = genrePreferences.getOrDefault(genre, 0);
            totalScore += preferenceWeight;
        }
        
        // Normalize score between 0 and 1
        double maxPossible = totalGenres * 3.0;
        return maxPossible > 0 ? totalScore / maxPossible : 0.3;
    }
    
    private double calculateGenreScore(Movie movie, String preferredGenre) {
        if (preferredGenre == null || preferredGenre.isBlank()) return 0.5;
        
        boolean matches = movie.getGenres().stream()
            .anyMatch(genre -> genre.equalsIgnoreCase(preferredGenre));
        
        return matches ? 1.0 : 0.0;
    }
    
    /**
     * Calculates popularity based on how many users favorited the movie
     * AI: Collaborative filtering - what others like
     */
    private double calculatePopularityScore(Movie movie) {
        int favoriteCount = movie.getFavoritedByUsers().size();
        long totalUsers = userRepository.count();
        
        if (totalUsers == 0) return 0.3;
        
        // Normalize between 0 and 1, with a max of 1.0
        return Math.min(1.0, favoriteCount / (double) totalUsers * 2);
    }
    
    /**
     * Converts MPAA rating to numeric score
     * AI: Content-based filtering using categorical data
     */
    private double calculateRatingScore(Movie movie) {
        String rating = movie.getRating();
        if (rating == null) return 0.5;
        
        return switch (rating.toUpperCase()) {
            case "G" -> 0.7;
            case "PG" -> 0.8;
            case "PG-13" -> 0.9;
            case "R" -> 0.75;
            case "NC-17" -> 0.6;
            default -> 0.5;
        };
    }
    
    /**
     * Analyzes user's favorite movies to identify genre preferences
     * AI: Pattern recognition from user behavior
     */
    private Map<String, Integer> calculateGenrePreferences(List<FavoriteMovieDto> favorites) {
        Map<String, Integer> genreCounts = new HashMap<>();
        
        // Note: FavoriteMovieDto doesn't have genres, so we need to fetch full movies
        for (FavoriteMovieDto fav : favorites) {
            Movie movie = movieRepository.findById(fav.getId()).orElse(null);
            if (movie != null) {
                for (String genre : movie.getGenres()) {
                    genreCounts.put(genre, genreCounts.getOrDefault(genre, 0) + 1);
                }
            }
        }
        
        return genreCounts;
    }
}