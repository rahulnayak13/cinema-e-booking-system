
package com.team17.cinema.entity;

import jakarta.persistence.*;

@Entity
public class Admin extends BaseUser {
        
    public Admin() {
        setRole(Role.ADMIN);
    }
    
}