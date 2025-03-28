package com.travelmate.service;

import com.travelmate.entity.ItineraryItem;
import com.travelmate.entity.ItineraryReview;
import com.travelmate.entity.User;
import com.travelmate.repository.ItineraryItemRepository;
import com.travelmate.repository.ItineraryReviewRepository;
import com.travelmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryReviewService {

    private final ItineraryReviewRepository reviewRepository;
    private final ItineraryItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItineraryReview addReview(Long itemId, ItineraryReview review, String username) {
        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Tappa non trovata"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        review.setItineraryItem(item);
        review.setUser(user);
        return reviewRepository.save(review);
    }

    public List<ItineraryReview> getReviewsForItem(Long itemId) {
        return reviewRepository.findByItineraryItemId(itemId);
    }

    public void deleteReview(Long reviewId, String username) {
        ItineraryReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Recensione non trovata"));

        if (!review.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato a eliminare questa recensione");
        }

        reviewRepository.delete(review);
    }
}
