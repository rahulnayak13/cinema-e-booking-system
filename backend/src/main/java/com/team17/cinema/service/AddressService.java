package com.team17.cinema.service;

import com.team17.cinema.dto.AddressDto;
import com.team17.cinema.entity.Address;
import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.AddressRepository;
import com.team17.cinema.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddressService {
    
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    
    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional(readOnly = true)
    public AddressDto getUserAddress(String email) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Address address = addressRepository.findByUserId(user.getId())
            .orElse(null);
        
        if (address == null) {
            return null;
        }
        
        return new AddressDto(
            address.getId(),
            address.getStreet(),
            address.getCity(),
            address.getState(),
            address.getZipCode()
        );
    }
    
    @Transactional
    public AddressDto saveOrUpdateAddress(String email, AddressDto addressDto) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Address existingAddress = addressRepository.findByUserId(user.getId())
            .orElse(null);
        
        Address address;
        if (existingAddress != null) {
            // Update existing
            address = existingAddress;
            address.setStreet(addressDto.getStreet());
            address.setCity(addressDto.getCity());
            address.setState(addressDto.getState());
            address.setZipCode(addressDto.getZipCode());
        } else {
            // Create new (max 1 per user enforced by unique constraint)
            address = new Address();
            address.setUser(user);
            address.setStreet(addressDto.getStreet());
            address.setCity(addressDto.getCity());
            address.setState(addressDto.getState());
            address.setZipCode(addressDto.getZipCode());
        }
        
        Address saved = addressRepository.save(address);
        return new AddressDto(
            saved.getId(),
            saved.getStreet(),
            saved.getCity(),
            saved.getState(),
            saved.getZipCode()
        );
    }
    
    @Transactional
    public void deleteAddress(String email) {
        BaseUser user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Address address = addressRepository.findByUserId(user.getId())
            .orElse(null);
        
        if (address != null) {
            addressRepository.delete(address);
        }
    }
}
