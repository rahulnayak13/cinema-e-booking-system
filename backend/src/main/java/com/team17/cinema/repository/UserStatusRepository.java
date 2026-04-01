package com.team17.cinema.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.team17.cinema.entity.UserStatus;

@Repository
public interface UserStatusRepository extends JpaRepository<UserStatus, Integer> {
    // This allows AuthService to find the "inactive" or "active" record in MySQL
    Optional<UserStatus> findByName(String name);
}