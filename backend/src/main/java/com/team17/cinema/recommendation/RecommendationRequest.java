package com.team17.cinema.recommendation;

import jakarta.validation.constraints.NotNull;

public class RecommendationRequest {
    
    private String email;  // User email (optional - for personalized recommendations)
    
    @NotNull(message = "Number of recommendations is required")
    private Integer limit = 10;
    
    private RecommendationType type = RecommendationType.HYBRID;
    
    private String preferredGenre;  // Optional - filter by genre
    
    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }
    
    public RecommendationType getType() { return type; }
    public void setType(RecommendationType type) { this.type = type; }
    
    public String getPreferredGenre() { return preferredGenre; }
    public void setPreferredGenre(String preferredGenre) { this.preferredGenre = preferredGenre; }
}