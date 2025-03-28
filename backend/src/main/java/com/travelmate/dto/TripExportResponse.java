package com.travelmate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TripExportResponse {
    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String imageUrl;
    private String username; // solo questo del proprietario
}
