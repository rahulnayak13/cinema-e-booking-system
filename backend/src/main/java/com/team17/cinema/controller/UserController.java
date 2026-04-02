package com.team17.cinema.controller;

import com.team17.cinema.dto.*;
import com.team17.cinema.service.PasswordService;
import com.team17.cinema.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
    
    private final ProfileService profileService;
    private final PasswordService passwordService;
    
    public UserController(ProfileService profileService, PasswordService passwordService) {
        this.profileService = profileService;
        this.passwordService = passwordService;
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getProfile(email));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication,
                                          @Valid @RequestBody UpdateProfileRequest request) {
        String email = authentication.getName();
        profileService.updateProfile(email, request);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(Authentication authentication,
                                            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            String email = authentication.getName();
            passwordService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
}