package com.team17.cinema.showtime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team17.cinema.movie.Movie;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "showtime")
public class Showtime {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    @JsonIgnore
    private Movie movie;
    
    @Column(name = "showroom_id", nullable = false)
    private Integer showroomId;
    
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    
    public Showtime() {}
    
    public Showtime(Movie movie, Integer showroomId, LocalDateTime startTime) {
        this.movie = movie;
        this.showroomId = showroomId;
        this.startTime = startTime;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }
    
    public Integer getShowroomId() { return showroomId; }
    public void setShowroomId(Integer showroomId) { this.showroomId = showroomId; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
}