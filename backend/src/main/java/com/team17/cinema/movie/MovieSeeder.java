package com.team17.cinema.movie;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Component
public class MovieSeeder implements CommandLineRunner {

    private final MovieRepository repo;

    public MovieSeeder(MovieRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;

        repo.saveAll(List.of(
                make("Neon Heist", MovieStatus.CURRENTLY_RUNNING, List.of("Action","Thriller"), "PG-13",
                        "A high-tech crew pulls one last job in a city that never sleeps.",
                        "https://picsum.photos/seed/neonheist/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-02-26"), LocalDate.parse("2026-02-27")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("Lunar Letters", MovieStatus.CURRENTLY_RUNNING, List.of("Drama","Romance"), "PG",
                        "Two strangers exchange messages through a moon relay.",
                        "https://picsum.photos/seed/lunarletters/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-02-25"), LocalDate.parse("2026-02-26")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("Circuit Breakers", MovieStatus.CURRENTLY_RUNNING, List.of("Sci-Fi","Action"), "PG-13",
                        "A rookie engineer uncovers the truth behind a citywide AI blackout.",
                        "https://picsum.photos/seed/circuitbreakers/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-02-27"), LocalDate.parse("2026-02-28")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("Peach State Mysteries", MovieStatus.CURRENTLY_RUNNING, List.of("Mystery","Comedy"), "PG-13",
                        "A small-town rumor turns into a big-time whodunit.",
                        "https://picsum.photos/seed/peachstate/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-02-24"), LocalDate.parse("2026-02-25")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("Garden of Giants", MovieStatus.CURRENTLY_RUNNING, List.of("Adventure","Family"), "PG",
                        "Kids discover a greenhouse where plants grow to impossible sizes.",
                        "https://picsum.photos/seed/garden/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-02-26")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),

                make("Midnight Atlas", MovieStatus.COMING_SOON, List.of("Fantasy","Adventure"), "PG-13",
                        "A mapmaker learns the world changes whenever the ink dries.",
                        "https://picsum.photos/seed/atlas/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-03-05"), LocalDate.parse("2026-03-06")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("After the Encore", MovieStatus.COMING_SOON, List.of("Drama","Music"), "PG",
                        "A singer faces the quiet moments after sudden fame.",
                        "https://picsum.photos/seed/encore/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-03-01")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("Cold Case: Redwood", MovieStatus.COMING_SOON, List.of("Thriller","Mystery"), "R",
                        "A detective reopens a case the town wants buried.",
                        "https://picsum.photos/seed/redwood/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-03-02"), LocalDate.parse("2026-03-03")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("Chef’s Table: Fire & Stone", MovieStatus.COMING_SOON, List.of("Comedy","Drama"), "PG-13",
                        "A burnt-out chef restarts with a food truck and stubborn team.",
                        "https://picsum.photos/seed/chefs/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-03-04")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                ),
                make("Skyline Sprint", MovieStatus.COMING_SOON, List.of("Action","Sport"), "PG-13",
                        "A runner joins an underground rooftop race to save a friend.",
                        "https://picsum.photos/seed/skyline/600/900",
                        "https://www.youtube.com/embed/dQw4w9WgXcQ",
                        List.of(LocalDate.parse("2026-03-07")),
                        List.of("2:00 PM","5:00 PM","8:00 PM")
                )
        ));
    }

    private Movie make(String title, MovieStatus status, List<String> genres, String rating,
                       String description, String posterUrl, String trailerUrl,
                       List<LocalDate> showDates, List<String> showtimes) {
        Movie m = new Movie();
        m.setTitle(title);
        m.setStatus(status);
        m.setGenres(new LinkedHashSet<>(genres));
        m.setRating(rating);
        m.setDescription(description);
        m.setPosterUrl(posterUrl);
        m.setTrailerUrl(trailerUrl);
        return m;
    }
}