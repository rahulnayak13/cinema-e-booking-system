package com.team17.cinema.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movie_preferences")
public class MoviePreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @Column(nullable = false)
    private String genre;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
}