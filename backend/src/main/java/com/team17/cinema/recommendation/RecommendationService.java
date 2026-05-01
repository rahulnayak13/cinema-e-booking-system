package com.team17.cinema.recommendation;

import java.util.List;

public interface RecommendationService {
    
    /**
     * Get personalized movie recommendations for a user
     * @param email - User email (anonymized in logs)
     * @param limit - Number of recommendations to return
     * @return List of recommended movies with relevance scores
     */
    List<RecommendationResponse.RecommendedMovie> getRecommendationsForUser(String email, int limit);
    
    /**
     * Get genre-based recommendations for anonymous users
     * @param preferredGenre - Genre user likes
     * @param limit - Number of recommendations to return
     * @return List of recommended movies
     */
    List<RecommendationResponse.RecommendedMovie> getGenreBasedRecommendations(String preferredGenre, int limit);
    
    /**
     * Get popular movies (fallback for anonymous users)
     * @param limit - Number of recommendations
     * @return List of popular movies
     */
    List<RecommendationResponse.RecommendedMovie> getPopularMovies(int limit);
}