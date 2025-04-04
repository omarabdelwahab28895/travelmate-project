package com.travelmate.controller;

import com.travelmate.entity.ItineraryReview;
import com.travelmate.service.ItineraryReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ItineraryReviewController {

    private final ItineraryReviewService reviewService;

    // ➕ Aggiungi recensione a una tappa
    @PostMapping("/{itemId}")
    public ResponseEntity<ItineraryReview> addReview(
            @PathVariable Long itemId,
            @RequestBody ItineraryReview review,
            @AuthenticationPrincipal UserDetails userDetails, Principal principal) {

        String username = principal.getName(); // 👈 ottieni il nome utente direttamente dal token
        ItineraryReview savedReview = reviewService.addReview(itemId, review, userDetails.getUsername());
        return ResponseEntity.ok(savedReview);
    }

    // 📋 Ottieni tutte le recensioni per una tappa
    @GetMapping("/{itemId}")
    public ResponseEntity<List<ItineraryReview>> getReviewsForItem(@PathVariable Long itemId) {
        List<ItineraryReview> reviews = reviewService.getReviewsForItem(itemId);
        return ResponseEntity.ok(reviews);
    }

    // 🗑️ Elimina recensione
    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserDetails userDetails, Principal principal) {


        //reviewService.deleteReview(reviewId, userDetails.getUsername());
        reviewService.deleteReview(reviewId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
