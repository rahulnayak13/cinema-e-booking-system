package com.team17.cinema.recommendation;

import com.team17.cinema.movie.Movie;
import java.util.List;
import java.util.Set;

public class RecommendationResponse {
    private List<RecommendedMovie> recommendations;
    private int totalCount;
    private String recommendationType;
    private String explanation;
    
    public RecommendationResponse(List<RecommendedMovie> recommendations, String recommendationType) {
        this.recommendations = recommendations;
        this.totalCount = recommendations.size();
        this.recommendationType = recommendationType;
        this.explanation = "AI-powered recommendations based on " + recommendationType.toLowerCase().replace("_", " ");
    }
    
    // Getters
    public List<RecommendedMovie> getRecommendations() { return recommendations; }
    public int getTotalCount() { return totalCount; }
    public String getRecommendationType() { return recommendationType; }
    public String getExplanation() { return explanation; }
    
    // Inner class for individual movie recommendation
    public static class RecommendedMovie {
        private Long id;
        private String title;
        private Set<String> genres;
        private String rating;
        private String posterUrl;
        private double relevanceScore;  // AI confidence score (0-100)
        
        public RecommendedMovie(Movie movie, double score) {
            this.id = movie.getId();
            this.title = movie.getTitle();
            this.genres = movie.getGenres();
            this.rating = movie.getRating();
            this.posterUrl = movie.getPosterUrl();
            this.relevanceScore = Math.min(100, Math.max(0, Math.round(score * 100)));
        }
        
        // Getters
        public Long getId() { return id; }
        public String getTitle() { return title; }
        public Set<String> getGenres() { return genres; }
        public String getRating() { return rating; }
        public String getPosterUrl() { return posterUrl; }
        public double getRelevanceScore() { return relevanceScore; }
    }
}