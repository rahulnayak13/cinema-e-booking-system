package com.team17.cinema.service;

import com.team17.cinema.entity.*;
import com.team17.cinema.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserQueryService {
    
    private final UserRepository userRepository;
    
    public UserQueryService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public BaseUser findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public long getTotalUserCount() {
        return userRepository.count();
    }
}