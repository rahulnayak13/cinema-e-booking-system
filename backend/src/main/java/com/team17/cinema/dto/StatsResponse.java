package com.team17.cinema.dto;

public class StatsResponse {
    private long totalUsers;
    private long totalAdmins;
    private long totalCustomers;
    private long activeUsers;
    private long totalMovies;
    private long totalShowtimes;
    private long totalBookings;
    
    // Constructors
    public StatsResponse() {}
    
    public StatsResponse(long totalUsers, long totalAdmins, long totalCustomers, 
                        long activeUsers, long totalMovies, long totalShowtimes, 
                        long totalBookings) {
        this.totalUsers = totalUsers;
        this.totalAdmins = totalAdmins;
        this.totalCustomers = totalCustomers;
        this.activeUsers = activeUsers;
        this.totalMovies = totalMovies;
        this.totalShowtimes = totalShowtimes;
        this.totalBookings = totalBookings;
    }
    
    // Getters
    public long getTotalUsers() { return totalUsers; }
    public long getTotalAdmins() { return totalAdmins; }
    public long getTotalCustomers() { return totalCustomers; }
    public long getActiveUsers() { return activeUsers; }
    public long getTotalMovies() { return totalMovies; }
    public long getTotalShowtimes() { return totalShowtimes; }
    public long getTotalBookings() { return totalBookings; }
}