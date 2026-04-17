package com.team17.cinema.controller;

import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.entity.UserStatus;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.repository.UserStatusRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserStatusRepository userStatusRepository;

    public AdminUserController(UserRepository userRepository, UserStatusRepository userStatusRepository) {
        this.userRepository = userRepository;
        this.userStatusRepository = userStatusRepository;
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
