package com.team17.cinema.movie;

import java.util.Set;

public class MovieResponse {
    private Long id;
    private String title;
    private MovieStatus status;
    private String rating;
    private String description;
    private String posterUrl;
    private String trailerUrl;
    private Set<String> genres;
    
    // Constructor from Movie entity
    public MovieResponse(Movie movie) {
        this.id = movie.getId();
        this.title = movie.getTitle();
        this.status = movie.getStatus();
        this.rating = movie.getRating();
        this.description = movie.getDescription();
        this.posterUrl = movie.getPosterUrl();
        this.trailerUrl = movie.getTrailerUrl();
        this.genres = movie.getGenres();
    }
    
    // Getters only (no setters needed for response)
    public Long getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public MovieStatus getStatus() {
        return status;
    }
    
    public String getRating() {
        return rating;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getPosterUrl() {
        return posterUrl;
    }
    
    public String getTrailerUrl() {
        return trailerUrl;
    }
    
    public Set<String> getGenres() {
        return genres;
    }
}