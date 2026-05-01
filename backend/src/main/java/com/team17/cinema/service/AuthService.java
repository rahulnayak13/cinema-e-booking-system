package com.team17.cinema.service;

import com.team17.cinema.dto.*;
import com.team17.cinema.entity.*;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.repository.UserStatusRepository;
import com.team17.cinema.security.TokenProvider;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final UserStatusRepository userStatusRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final EmailService emailService;
    
    public AuthService(
        UserRepository userRepository,
        UserStatusRepository userStatusRepository,
        PasswordEncoder passwordEncoder,
        TokenProvider tokenProvider,
        EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.userStatusRepository = userStatusRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
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
        UserStatus inactiveStatus = userStatusRepository.findByName("inactive")
            .orElseThrow(() -> new RuntimeException("Default user status 'inactive' not found"));
        customer.setStatus(inactiveStatus);
        customer.setVerificationToken(UUID.randomUUID().toString());
        
        Customer savedCustomer = (Customer) userRepository.save(customer);
        emailService.sendVerificationEmail(savedCustomer, savedCustomer.getVerificationToken());
        return savedCustomer;
    }
    
    public AuthResponse login(LoginRequest request) {
        BaseUser user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        if (user.getStatus() != null && "inactive".equalsIgnoreCase(user.getStatus().getName())) {
            throw new RuntimeException("Please verify your email before logging in.");
        }
        
        String role = user instanceof Admin ? "ADMIN" : "CUSTOMER";

        String token = tokenProvider.generateToken(user.getEmail());
        return new AuthResponse("Login successful", user.getEmail(), role, true, token);
    }
    
    public void logout(String token) {
        if (token != null && !token.isEmpty()) {
            // Revoke/invalidate the token
            tokenProvider.revokeToken(token);
        }
        // Clear security context
        SecurityContextHolder.clearContext();
    }
    
    @Transactional
    public void verifyEmail(String token, String email) {
        Optional<BaseUser> userByToken = userRepository.findByVerificationToken(token);

        if (userByToken.isEmpty()) {
            // Token not found — check if the account is already active
            if (email != null && !email.isBlank()) {
                Optional<BaseUser> userByEmail = userRepository.findByEmail(email);
                if (userByEmail.isPresent()
                        && "active".equalsIgnoreCase(userByEmail.get().getStatus().getName())) {
                    throw new RuntimeException("This account is already verified.");
                }
            }
            throw new RuntimeException("Invalid or expired verification token. Please request a new one.");
        }

        BaseUser user = userByToken.get();
        UserStatus activeStatus = userStatusRepository.findByName("active")
            .orElseThrow(() -> new RuntimeException("Default user status 'active' not found"));
        user.setStatus(activeStatus);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != null && "active".equalsIgnoreCase(user.getStatus().getName())) {
            throw new RuntimeException("This account is already verified.");
        }

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);
        emailService.sendVerificationEmail(user, token);
    }
}