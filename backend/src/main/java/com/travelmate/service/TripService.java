package com.travelmate.service;

import com.lowagie.text.*;
import java.awt.Color;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.travelmate.dto.TripExportResponse;
import com.travelmate.dto.UpdateTripRequest;
import com.travelmate.entity.Trip;
import com.travelmate.entity.User;
import com.travelmate.repository.TripRepository;
import com.travelmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public Trip createTrip(String username, Trip trip) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        trip.setUser(user);

        if (trip.getStartDate() == null) {
            trip.setStartDate(java.time.LocalDate.now());
        }
        if (trip.getEndDate() == null) {
            trip.setEndDate(trip.getStartDate());
        }

        if (trip.getItineraryItems() != null) {
            trip.getItineraryItems().forEach(item -> item.setTrip(trip));
        }

        return tripRepository.save(trip);
    }

    public List<Trip> getTripsByUsername(String username, String destination) {
        if (destination != null && !destination.isBlank()) {
            return tripRepository.findByUserUsernameAndDestinationContainingIgnoreCaseOrderByStartDateAsc(username, destination);
        } else {
            return tripRepository.findByUserUsernameOrderByStartDateAsc(username);
        }
    }

    public Trip getTripById(Long tripId, String username) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Viaggio non trovato"));

        if (!trip.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato a visualizzare questo viaggio");
        }

        return trip;
    }

    public long countTrips(String username) {
        return tripRepository.countByUserUsername(username);
    }

    public Trip updateTrip(Long tripId, UpdateTripRequest request, String username) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Viaggio non trovato"));

        if (!trip.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato a modificare questo viaggio");
        }

        if (request.getDestination() != null) trip.setDestination(request.getDestination());
        if (request.getStartDate() != null) trip.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) trip.setEndDate(request.getEndDate());
        if (request.getDescription() != null) trip.setDescription(request.getDescription());
        if (request.getImageUrl() != null) trip.setImageUrl(request.getImageUrl());

        return tripRepository.save(trip);
    }

    public void deleteTrip(Long tripId, String username) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Viaggio non trovato"));

        if (!trip.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato a eliminare questo viaggio");
        }

        tripRepository.delete(trip);
    }

    public List<TripExportResponse> exportTrips(String username) {
        List<Trip> trips = getTripsByUsername(username, null);
        return trips.stream()
                .map(trip -> new TripExportResponse(
                        trip.getId(),
                        trip.getDestination(),
                        trip.getStartDate(),
                        trip.getEndDate(),
                        trip.getDescription(),
                        trip.getImageUrl(),
                        trip.getUser().getUsername(),
                        trip.getItineraryItems()
                ))
                .toList();
    }

    public byte[] exportTripsAsCsv(String username) {
        List<TripExportResponse> trips = exportTrips(username);

        StringBuilder csv = new StringBuilder();
        csv.append("Destinazione,Data Inizio,Data Fine,Descrizione,Tappe\n");

        for (TripExportResponse trip : trips) {
            String itinerary = trip.getItinerary().stream()
                    .map(item -> item.getDate() + ": " + item.getTitle())
                    .collect(Collectors.joining(" | "));

            csv.append(trip.getDestination()).append(",");
            csv.append(trip.getStartDate()).append(",");
            csv.append(trip.getEndDate()).append(",");
            csv.append("\"").append(trip.getDescription() != null ? trip.getDescription().replace("\"", "\"\"") : "").append("\"").append(",");
            csv.append("\"").append(itinerary.replace("\"", "\"\"")).append("\"\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportTripsAsPdf(String username) {
        List<TripExportResponse> trips = exportTrips(username);

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("I miei viaggi", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            for (TripExportResponse trip : trips) {
                Paragraph tripTitle = new Paragraph(trip.getDestination() + " (" + trip.getStartDate() + " - " + trip.getEndDate() + ")", boldFont);
                document.add(tripTitle);

                if (trip.getDescription() != null) {
                    document.add(new Paragraph("Descrizione: " + trip.getDescription(), normalFont));
                }

                if (trip.getItinerary() != null && !trip.getItinerary().isEmpty()) {
                    document.add(new Paragraph("Tappe:", boldFont));
                    PdfPTable table = new PdfPTable(3);
                    table.setWidthPercentage(100);
                    table.setWidths(new int[]{2, 3, 5});

                    Stream.of("Data", "Titolo", "Descrizione").forEach(header -> {
                        PdfPCell cell = new PdfPCell(new Phrase(header, boldFont));
                        cell.setBackgroundColor(Color.LIGHT_GRAY);
                        table.addCell(cell);
                    });

                    for (var item : trip.getItinerary()) {
                        table.addCell(item.getDate() != null ? item.getDate().toString() : "");
                        table.addCell(item.getTitle() != null ? item.getTitle() : "");
                        table.addCell(item.getDescription() != null ? item.getDescription() : "");
                    }

                    document.add(table);
                }

                document.add(Chunk.NEWLINE);
            }

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Errore durante la generazione del PDF", e);
        }

        return out.toByteArray();
    }
}
