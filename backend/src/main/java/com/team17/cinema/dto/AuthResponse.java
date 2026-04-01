package com.team17.cinema.dto;

public class AuthResponse {
    private String message;
    private String email;
    private String role;
    private boolean active;
    private String token;  // Add this - we'll generate a simple token for now
    
    public AuthResponse(String message, String email, String role, boolean active) {
        this.message = message;
        this.email = email;
        this.role = role;
        this.active = active;
        // Generate a simple token (in production, use JWT)
        this.token = java.util.UUID.randomUUID().toString();
    }
    
    public AuthResponse(String message, String email, String role, boolean active, String token) {
        this.message = message;
        this.email = email;
        this.role = role;
        this.active = active;
        this.token = token;
    }
    
    // Getters
    public String getMessage() { return message; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
    public String getToken() { return token; }
}