package com.team17.cinema.recommendation;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    
    private final RecommendationService recommendationService;
    
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }
    
    /**
     * Get AI-powered movie recommendations
     * Does NOT transmit user identifiers in logs (anonymized)
     */
    @PostMapping("/movies")
    public ResponseEntity<RecommendationResponse> getRecommendations(@Valid @RequestBody RecommendationRequest request) {
        List<RecommendationResponse.RecommendedMovie> recommendations;
        
        // Anonymize user email in logs (privacy compliance)
        logAnonymizedRequest(request);
        
        switch (request.getType()) {
            case GENRE_BASED:
                recommendations = recommendationService.getGenreBasedRecommendations(
                    request.getPreferredGenre(), 
                    request.getLimit()
                );
                break;
            case POPULAR:
                recommendations = recommendationService.getPopularMovies(request.getLimit());
                break;
            case SIMILAR_FAVORITES:
            case HYBRID:
            default:
                if (request.getEmail() != null && !request.getEmail().isBlank()) {
                    recommendations = recommendationService.getRecommendationsForUser(
                        request.getEmail(), 
                        request.getLimit()
                    );
                } else {
                    recommendations = recommendationService.getPopularMovies(request.getLimit());
                }
                break;
        }
        
        RecommendationResponse response = new RecommendationResponse(recommendations, request.getType().name());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get popular recommendations without login (anonymous)
     */
    @GetMapping("/popular")
    public ResponseEntity<RecommendationResponse> getPopularRecommendations(@RequestParam(defaultValue = "10") int limit) {
        List<RecommendationResponse.RecommendedMovie> recommendations = 
            recommendationService.getPopularMovies(limit);
        
        RecommendationResponse response = new RecommendationResponse(recommendations, "POPULAR");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get genre-based recommendations (anonymous)
     */
    @GetMapping("/genre")
    public ResponseEntity<RecommendationResponse> getGenreRecommendations(
            @RequestParam String genre,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<RecommendationResponse.RecommendedMovie> recommendations = 
            recommendationService.getGenreBasedRecommendations(genre, limit);
        
        RecommendationResponse response = new RecommendationResponse(recommendations, "GENRE_BASED");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Anonymize user data before logging (privacy compliance)
     */
    private void logAnonymizedRequest(RecommendationRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Only log hashed email, not the actual email
            String hashedEmail = Integer.toHexString(request.getEmail().hashCode());
            System.out.println("Recommendation request for user: hash_" + hashedEmail);
        } else {
            System.out.println("Recommendation request for anonymous user");
        }
        System.out.println("  Type: " + request.getType() + ", Limit: " + request.getLimit());
    }
}