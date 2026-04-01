
package com.team17.cinema.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class BaseUser implements User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.INACTIVE;
    
    private String resetToken;
    private LocalDateTime resetTokenExpiry;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    @Override
    public Long getId() { return id; }
    
    @Override
    public void setId(Long id) { this.id = id; }
    
    @Override
    public String getEmail() { return email; }
    
    @Override
    public void setEmail(String email) { this.email = email; }
    
    @Override
    public String getPassword() { return password; }
    
    @Override
    public void setPassword(String password) { this.password = password; }
    
    @Override
    public String getFirstName() { return firstName; }
    
    @Override
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    @Override
    public String getLastName() { return lastName; }
    
    @Override
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    @Override
    public String getPhone() { return phone; }
    
    @Override
    public void setPhone(String phone) { this.phone = phone; }
    
    @Override
    public Role getRole() { return role; }
    
    @Override
    public void setRole(Role role) { this.role = role; }
    
    @Override
    public UserStatus getStatus() { return status; }
    
    @Override
    public void setStatus(UserStatus status) { this.status = status; }
    
    @Override
    public String getResetToken() { return resetToken; }
    
    @Override
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    
    @Override
    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    
    @Override
    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }
    
    @Override
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}