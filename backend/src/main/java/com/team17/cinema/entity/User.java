// src/main/java/com/team17/cinema/entity/User.java
package com.team17.cinema.entity;

import java.time.LocalDateTime;

public interface User {
    Long getId();
    void setId(Long id);
    
    String getEmail();
    void setEmail(String email);
    
    String getPassword();
    void setPassword(String password);
    
    String getFirstName();
    void setFirstName(String firstName);
    
    String getLastName();
    void setLastName(String lastName);
    
    String getPhone();
    void setPhone(String phone);
    
    Role getRole();
    void setRole(Role role);
    
    UserStatus getStatus();
    void setStatus(UserStatus status);
    
    String getResetToken();
    void setResetToken(String resetToken);
    
    LocalDateTime getResetTokenExpiry();
    void setResetTokenExpiry(LocalDateTime resetTokenExpiry);
    
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
}