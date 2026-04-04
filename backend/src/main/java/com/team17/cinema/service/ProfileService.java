package com.team17.cinema.service;

import com.team17.cinema.dto.UpdateProfileRequest;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class ProfileService {

    private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public ProfileService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public BaseUser getProfile(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public BaseUser updateProfile(String email, UpdateProfileRequest request) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasChanges =
            !Objects.equals(user.getFirstName(), request.getFirstName())
                || !Objects.equals(user.getLastName(), request.getLastName())
                || !Objects.equals(user.getPhone(), request.getPhone());

        if (!hasChanges) {
            return user;
        }
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        BaseUser savedUser = userRepository.save(user);
        try {
            emailService.sendProfileUpdatedEmail(savedUser);
        } catch (RuntimeException ex) {
            logger.warn("Profile updated but email notification failed for {}: {}", savedUser.getEmail(), ex.getMessage());
        }

        return savedUser;
    }
}
