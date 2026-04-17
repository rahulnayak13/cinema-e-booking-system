package com.team17.cinema.entity;

import com.team17.cinema.entity.converter.RoleConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.team17.cinema.movie.Movie;

@Entity
@Table(name = "users") // Maps to your existing table
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class BaseUser implements User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "password_hash", nullable = false) // Match your data.sql column name
    private String password;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    private String phone;
    
    @Convert(converter = RoleConverter.class)
    @Column(name = "user_type_id")
    private Role role;
    
    @ManyToOne // Change from Enumerated to match your status_id FK
    @JoinColumn(name = "status_id")
    private UserStatus status;
    
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private List<Movie> favoriteMovies = new ArrayList<>();
    
    @Column(name = "verification_token") // New field for email confirmation
    private String verificationToken;
    
    private String resetToken;
    private LocalDateTime resetTokenExpiry;
    
@Column(name = "promotion_subscribed", nullable = false)
    private boolean promotionSubscribed = false;

    @Column(name = "created_at", updatable = false)
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

    // New verification token methods
    @Override
    public String getVerificationToken() { return verificationToken; }

    @Override
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    
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
    
    public List<Movie> getFavoriteMovies() { return favoriteMovies; }
    public void setFavoriteMovies(List<Movie> favoriteMovies) { this.favoriteMovies = favoriteMovies; }

    public boolean isPromotionSubscribed() { return promotionSubscribed; }
    public void setPromotionSubscribed(boolean promotionSubscribed) { this.promotionSubscribed = promotionSubscribed; }
}