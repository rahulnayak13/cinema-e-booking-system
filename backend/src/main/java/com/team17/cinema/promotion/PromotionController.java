package com.team17.cinema.promotion;

import com.team17.cinema.entity.BaseUser;
import com.team17.cinema.repository.UserRepository;
import com.team17.cinema.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/promotions")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {

    private final PromotionRepository promotionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public PromotionController(PromotionRepository promotionRepository,
                               UserRepository userRepository,
                               EmailService emailService) {
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPromotion(
            @Valid @RequestBody PromotionRequest request,
            @RequestParam(defaultValue = "false") boolean sendEmail) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "End date must be after start date");
            return ResponseEntity.badRequest().body(error);
        }

        Promotion promotion = new Promotion();
        promotion.setTitle(request.getTitle());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountPercent(request.getDiscountPercent());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setPromoCode(request.getPromoCode());

        Promotion saved = promotionRepository.save(promotion);

        if (sendEmail) {
            List<BaseUser> subscribedUsers = userRepository.findAll().stream()
                    .filter(u -> u.isPromotionSubscribed())
                    .toList();
            for (BaseUser user : subscribedUsers) {
                try {
                    emailService.sendPromotionEmail(user, saved);
                } catch (Exception ignored) {
                    // don't fail the request if email fails for one user
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePromotion(@PathVariable Long id) {
        promotionRepository.deleteById(id);
    }
}
