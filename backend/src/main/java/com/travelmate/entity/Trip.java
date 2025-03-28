package com.travelmate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    // ✅ Campo per l'immagine
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ✅ Lista delle tappe dell'itinerario
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItineraryItem> itineraryItems;
}
