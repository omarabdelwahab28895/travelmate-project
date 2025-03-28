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

    // 🟢 Usa questi due campi per l'intervallo viaggio
    private LocalDate startDate;
    private LocalDate endDate;

    // 🟢 Salva le note o descrizione
    private String description;

    // 🟢 Se usi immagini
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // (Facoltativo) Lista di tappe
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItineraryItem> itineraryItems;
}
