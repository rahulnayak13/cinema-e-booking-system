package com.team17.cinema.movie;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.showtime.Showtime;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genres")
    private Set<String> genres = new LinkedHashSet<>();

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Showtime> showtimes = new ArrayList<>();
    
    @ManyToMany(mappedBy = "favoriteMovies")
    @JsonIgnore
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

    public Set<String> getGenres() { return genres; }
    public void setGenres(Set<String> genres) { this.genres = genres; }

    public List<Showtime> getShowtimes() { return showtimes; }
    public void setShowtimes(List<Showtime> showtimes) { this.showtimes = showtimes; }
    
    public List<BaseUser> getFavoritedByUsers() { return favoritedByUsers; }
    public void setFavoritedByUsers(List<BaseUser> favoritedByUsers) { this.favoritedByUsers = favoritedByUsers; }

    public void addShowtime(Showtime showtime) {
        showtimes.add(showtime);
        showtime.setMovie(this);
    }
    
    public void removeShowtime(Showtime showtime) {
        showtimes.remove(showtime);
        showtime.setMovie(null);
    }
}