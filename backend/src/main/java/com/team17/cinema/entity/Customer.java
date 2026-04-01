
package com.team17.cinema.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Customer extends BaseUser {
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MoviePreference> preferences = new ArrayList<>();
    
    public Customer() {
        setRole(Role.CUSTOMER);
    }
    
    public List<MoviePreference> getPreferences() {
        return preferences;
    }
    
    public void setPreferences(List<MoviePreference> preferences) {
        this.preferences = preferences;
    }
    
    public void addPreference(MoviePreference preference) {
        preferences.add(preference);
        preference.setCustomer(this);
    }
    
    public void removePreference(MoviePreference preference) {
        preferences.remove(preference);
        preference.setCustomer(null);
    }
}