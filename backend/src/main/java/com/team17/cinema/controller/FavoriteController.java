package com.team17.cinema.controller;

import com.team17.cinema.dto.FavoriteMovieDto;
import com.team17.cinema.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FavoriteController {
    
    private final FavoriteService favoriteService;
    
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }
    
    @GetMapping
    public ResponseEntity<?> getUserFavorites(Authentication authentication) {
        String email = authentication.getName();
        List<FavoriteMovieDto> favorites = favoriteService.getUserFavorites(email);
        return ResponseEntity.ok(favorites);
    }
    
    @GetMapping("/check/{movieId}")
    public ResponseEntity<?> checkIfFavorite(Authentication authentication, @PathVariable Long movieId) {
        String email = authentication.getName();
        boolean isFavorite = favoriteService.isFavorite(email, movieId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFavorite", isFavorite);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{movieId}")
    public ResponseEntity<?> addFavorite(Authentication authentication, @PathVariable Long movieId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.status(401).body(error);
        }
        
        try {
            String email = authentication.getName();
            favoriteService.addFavorite(email, movieId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Movie added to favorites");
            response.put("success", "true");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log to backend console for debugging
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : "Failed to add favorite");
            error.put("success", "false");
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{movieId}")
    public ResponseEntity<?> removeFavorite(Authentication authentication, @PathVariable Long movieId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.status(401).body(error);
        }
        
        try {
            String email = authentication.getName();
            favoriteService.removeFavorite(email, movieId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Movie removed from favorites");
            response.put("success", "true");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log to backend console for debugging
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : "Failed to remove favorite");
            error.put("success", "false");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
