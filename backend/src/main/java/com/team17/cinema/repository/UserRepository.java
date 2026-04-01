package com.team17.cinema.repository;

import com.team17.cinema.entity.BaseUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<BaseUser, Long> {
    Optional<BaseUser> findByEmail(String email);
    Optional<BaseUser> findByResetToken(String resetToken);
    boolean existsByEmail(String email);
}