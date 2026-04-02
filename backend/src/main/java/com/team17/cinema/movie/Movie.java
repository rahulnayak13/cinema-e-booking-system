package com.team17.cinema.movie;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.team17.cinema.entity.BaseUser;

@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Enumerated(EnumType.STRING)
    private MovieStatus status;

    private String rating;

    @Column(length = 2000)
    private String description;

    private String posterUrl;
    private String trailerUrl;

    @ElementCollection
    private List<String> genres = new ArrayList<>();

    @ElementCollection
    private List<LocalDate> showDates = new ArrayList<>();

    @ElementCollection
    private List<String> showtimes = new ArrayList<>();
    
    @ManyToMany(mappedBy = "favoriteMovies")
    private List<BaseUser> favoritedByUsers = new ArrayList<>();

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public MovieStatus getStatus() { return status; }
    public void setStatus(MovieStatus status) { this.status = status; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public List<String> getGenres() { return genres; }
    public void setGenres(List<String> genres) { this.genres = genres; }

    public List<LocalDate> getShowDates() { return showDates; }
    public void setShowDates(List<LocalDate> showDates) { this.showDates = showDates; }

    public List<String> getShowtimes() { return showtimes; }
    public void setShowtimes(List<String> showtimes) { this.showtimes = showtimes; }
    
    public List<BaseUser> getFavoritedByUsers() { return favoritedByUsers; }
    public void setFavoritedByUsers(List<BaseUser> favoritedByUsers) { this.favoritedByUsers = favoritedByUsers; }
}