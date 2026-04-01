package com.team17.cinema.service;

import com.team17.cinema.dto.*;
import com.team17.cinema.entity.*;
import com.team17.cinema.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public Customer register(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        Customer customer = new Customer();
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhone(request.getPhone());
        customer.setStatus(UserStatus.INACTIVE);
        
        return (Customer) userRepository.save(customer);
    }
    
    public AuthResponse login(LoginRequest request) {
        BaseUser user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        String role = user instanceof Admin ? "ADMIN" : "CUSTOMER";

        String token = UUID.randomUUID().toString();
        return new AuthResponse("Login successful", user.getEmail(), role, true, token);
    }
    
    public void logout(String email) {
        // For stateless JWT, logout is handled client-side
    }
}