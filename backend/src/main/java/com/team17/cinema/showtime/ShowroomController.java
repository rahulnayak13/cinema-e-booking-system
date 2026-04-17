package com.team17.cinema.showtime;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/showrooms")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowroomController {

    // For now, return hardcoded list (or you can create a Showroom entity later)
    @GetMapping
    public List<Map<String, Object>> getShowrooms() {
        return List.of(
            Map.of("id", 1, "name", "Screen 1", "capacity", 100),
            Map.of("id", 2, "name", "Screen 2", "capacity", 80),
            Map.of("id", 3, "name", "Screen 3", "capacity", 60)
        );
    }
}