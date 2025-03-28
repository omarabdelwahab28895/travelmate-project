package com.travelmate.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTripRequest {

    @Size(min = 3, message = "La destinazione deve contenere almeno 3 caratteri")
    private String destination;

    @FutureOrPresent(message = "La data di inizio deve essere nel presente o futuro")
    private LocalDate startDate;

    @FutureOrPresent(message = "La data di fine deve essere nel presente o futuro")
    private LocalDate endDate;

    @Size(max = 255, message = "La descrizione non può superare 255 caratteri")
    private String description;

    private String imageUrl; // ➕ Campo per immagine
}
