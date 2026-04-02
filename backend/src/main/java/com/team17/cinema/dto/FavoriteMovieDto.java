package com.team17.cinema.dto;

public class FavoriteMovieDto {
    private Long id;
    private String title;
    private String posterUrl;
    private String rating;
    private String description;
    
    public FavoriteMovieDto() {}
    
    public FavoriteMovieDto(Long id, String title, String posterUrl, String rating, String description) {
        this.id = id;
        this.title = title;
        this.posterUrl = posterUrl;
        this.rating = rating;
        this.description = description;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
