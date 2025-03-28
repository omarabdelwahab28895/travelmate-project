package com.travelmate.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;
    private int rating; // da 1 a 5, ad esempio

    @ManyToOne
    @JoinColumn(name = "itinerary_item_id")
    private ItineraryItem itineraryItem;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
