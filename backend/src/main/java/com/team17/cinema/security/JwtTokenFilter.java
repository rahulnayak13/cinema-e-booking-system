package com.team17.cinema.security;

import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

public class JwtTokenFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    public JwtTokenFilter(UserRepository userRepository, TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String token = extractToken(request);
            
            if (token != null) {
                String email = tokenProvider.getEmailFromToken(token);
                
                if (email != null) {
                    Optional<BaseUser> user = userRepository.findByEmail(email);
                    
                    if (user.isPresent()) {
                        BaseUser foundUser = user.get();
                        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                        
                        if (foundUser.getRole() != null) {
                            authorities.add(new SimpleGrantedAuthority("ROLE_" + foundUser.getRole().name()));
                        }
                        
                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
