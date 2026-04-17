package com.team17.cinema.showtime;

import java.time.LocalDateTime;

public class ShowtimeResponse {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private Integer showroomId;
    private LocalDateTime startTime;
    
    public ShowtimeResponse(Showtime showtime) {
        this.id = showtime.getId();
        this.movieId = showtime.getMovie().getId();
        this.movieTitle = showtime.getMovie().getTitle();
        this.showroomId = showtime.getShowroomId();
        this.startTime = showtime.getStartTime();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getMovieId() { return movieId; }
    public String getMovieTitle() { return movieTitle; }
    public Integer getShowroomId() { return showroomId; }
    public LocalDateTime getStartTime() { return startTime; }
}