package com.team17.cinema.controller;

import com.team17.cinema.entity.Admin;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.entity.UserStatus;
import com.team17.cinema.entity.Role;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.repository.UserStatusRepository;
import com.team17.cinema.dto.AdminUserRequest;
import com.team17.cinema.dto.StatsResponse;
import com.team17.cinema.movie.MovieRepository;
import com.team17.cinema.showtime.ShowtimeRepository;
import com.team17.cinema.booking.BookingRepository;
import com.team17.cinema.service.UserQueryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserStatusRepository userStatusRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserQueryService userQueryService;
    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;
    private final BookingRepository bookingRepository;

    public AdminUserController(UserRepository userRepository, 
                               UserStatusRepository userStatusRepository,
                               PasswordEncoder passwordEncoder,
                               UserQueryService userQueryService,
                               MovieRepository movieRepository,
                               ShowtimeRepository showtimeRepository,
                               BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.userStatusRepository = userStatusRepository;
        this.passwordEncoder = passwordEncoder;
        this.userQueryService = userQueryService;
        this.movieRepository = movieRepository;
        this.showtimeRepository = showtimeRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StatsResponse> getStats() {
        StatsResponse stats = new StatsResponse(
            userQueryService.getTotalUserCount(),
            userQueryService.getTotalAdminCount(),
            userQueryService.getTotalCustomerCount(),
            userQueryService.getActiveUserCount(),
            movieRepository.count(),
            showtimeRepository.count(),
            bookingRepository.count()  // Now using your existing BookingRepository
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> Map.<String, Object>of(
                "id", u.getId(),
                "email", u.getEmail(),
                "firstName", u.getFirstName() != null ? u.getFirstName() : "",
                "lastName", u.getLastName() != null ? u.getLastName() : "",
                "phone", u.getPhone() != null ? u.getPhone() : "",
                "role", u.getRole() != null ? u.getRole().name() : "",
                "status", u.getStatus() != null ? u.getStatus().getName() : "",
                "promotionSubscribed", u.isPromotionSubscribed()
        )).toList();
    }

    @PostMapping("/admin")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAdmin(@Valid @RequestBody AdminUserRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists: " + request.getEmail()));
        }
        
        // Get active status
        UserStatus activeStatus = userStatusRepository.findByName("active")
                .orElseThrow(() -> new RuntimeException("Active status not found"));
        
        // Create new admin user
        Admin admin = new Admin();
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setPhone(request.getPhone());
        admin.setRole(Role.ADMIN);
        admin.setStatus(activeStatus);
        admin.setPromotionSubscribed(request.isPromotionSubscribed() != null ? request.isPromotionSubscribed() : false);
        
        BaseUser saved = userRepository.save(admin);
        
        return ResponseEntity.ok(Map.of(
                "message", "Admin account created successfully",
                "id", saved.getId(),
                "email", saved.getEmail(),
                "role", "ADMIN"
        ));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        BaseUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        userRepository.delete(user);
        
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusName = body.get("status");
        if (statusName == null || statusName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
        }
        BaseUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserStatus status = userStatusRepository.findByName(statusName)
                .orElseThrow(() -> new RuntimeException("Invalid status: " + statusName));
        user.setStatus(status);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}
