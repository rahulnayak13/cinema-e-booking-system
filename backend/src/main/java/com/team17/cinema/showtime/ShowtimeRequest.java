
package com.team17.cinema.showtime;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ShowtimeRequest {
    
    @NotNull(message = "Movie ID is required")
    private Long movieId;
    
    @NotNull(message = "Showroom ID is required")
    private Integer showroomId;
    
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    
    // Getters and Setters
    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    
    public Integer getShowroomId() { return showroomId; }
    public void setShowroomId(Integer showroomId) { this.showroomId = showroomId; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
}