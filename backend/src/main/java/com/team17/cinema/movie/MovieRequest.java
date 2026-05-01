package com.team17.cinema.movie;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class MovieRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private MovieStatus status;
    
    private String rating;
    
    private String description;
    
    private String posterUrl;
    
    private String trailerUrl;

    private String cast;

    private String director;

    private String producer;

    private String reviews;
    
    private Set<String> genres;
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public MovieStatus getStatus() {
        return status;
    }
    
    public void setStatus(MovieStatus status) {
        this.status = status;
    }
    
    public String getRating() {
        return rating;
    }
    
    public void setRating(String rating) {
        this.rating = rating;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPosterUrl() {
        return posterUrl;
    }
    
    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
    
    public String getTrailerUrl() {
        return trailerUrl;
    }
    
    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    public String getCast() {
        return cast;
    }

    public void setCast(String cast) {
        this.cast = cast;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getReviews() {
        return reviews;
    }

    public void setReviews(String reviews) {
        this.reviews = reviews;
    }
    
    public Set<String> getGenres() {
        return genres;
    }
    
    public void setGenres(Set<String> genres) {
        this.genres = genres;
    }
}