package com.team17.cinema.controller;

import com.team17.cinema.dto.AddressDto;
import com.team17.cinema.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/address")
public class AddressController {
    
    private final AddressService addressService;
    
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }
    
    @GetMapping
    public ResponseEntity<?> getUserAddress(Authentication authentication) {
        String email = authentication.getName();
        AddressDto address = addressService.getUserAddress(email);
        if (address == null) {
            return ResponseEntity.ok(new HashMap<>());
        }
        return ResponseEntity.ok(address);
    }
    
    @PostMapping
    public ResponseEntity<?> saveOrUpdateAddress(Authentication authentication, @RequestBody AddressDto addressDto) {
        try {
            String email = authentication.getName();
            AddressDto saved = addressService.saveOrUpdateAddress(email, addressDto);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping
    public ResponseEntity<?> deleteAddress(Authentication authentication) {
        try {
            String email = authentication.getName();
            addressService.deleteAddress(email);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Address deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
