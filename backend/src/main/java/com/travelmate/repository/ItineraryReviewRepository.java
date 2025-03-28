package com.travelmate.repository;

import com.travelmate.entity.ItineraryReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItineraryReviewRepository extends JpaRepository<ItineraryReview, Long> {
    List<ItineraryReview> findByItineraryItemId(Long itineraryItemId);
}
