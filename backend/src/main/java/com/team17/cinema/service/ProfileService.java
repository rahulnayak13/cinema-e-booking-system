package com.team17.cinema.service;

import com.team17.cinema.dto.UpdateProfileRequest;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {
    
    private final UserRepository userRepository;
    
    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public BaseUser getProfile(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public BaseUser updateProfile(String email, UpdateProfileRequest request) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        
        return userRepository.save(user);
    }
}
