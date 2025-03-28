package com.travelmate.dto;

import com.travelmate.entity.ItineraryItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class TripExportResponse {
    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String imageUrl;
    private String username; // proprietario del viaggio

    // 🟢 Aggiunta lista tappe
    private List<ItineraryItem> itinerary;
}
