package com.team17.cinema.repository;

import com.team17.cinema.entity.PaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentCardRepository extends JpaRepository<PaymentCard, Integer> {
    List<PaymentCard> findByUserId(Long userId);
    int countByUserId(Long userId);
}
