package com.team17.cinema.security;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenProvider {
    private static final ConcurrentHashMap<String, String> tokenMap = new ConcurrentHashMap<>();

    public String generateToken(String email) {
        String token = java.util.UUID.randomUUID().toString();
        tokenMap.put(token, email);
        return token;
    }

    public String getEmailFromToken(String token) {
        return tokenMap.get(token);
    }

    public boolean validateToken(String token) {
        return tokenMap.containsKey(token);
    }

    public void revokeToken(String token) {
        tokenMap.remove(token);
    }
}
