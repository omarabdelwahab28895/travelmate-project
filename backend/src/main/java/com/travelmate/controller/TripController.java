package com.travelmate.controller;

import com.travelmate.dto.TripExportResponse;
import com.travelmate.dto.UpdateTripRequest;
import com.travelmate.entity.Trip;
import com.travelmate.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Trip savedTrip = tripService.createTrip(username, trip);
        return ResponseEntity.ok(savedTrip);
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getMyTrips(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String destination
    ) {
        String username = userDetails.getUsername();
        List<Trip> trips = tripService.getTripsByUsername(username, destination);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        Trip trip = tripService.getTripById(id, username);
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countTrips(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        long count = tripService.countTrips(username);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/export")
    public ResponseEntity<List<TripExportResponse>> exportTrips(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<TripExportResponse> trips = tripService.exportTrips(username);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportTripsCsv(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        byte[] csv = tripService.exportTripsAsCsv(username);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=viaggi.csv")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(csv);
    }

    // ✅ NUOVO endpoint PDF
    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportTripsPdf(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        byte[] pdf = tripService.exportTripsAsPdf(username);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=viaggi.pdf")
                .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                .body(pdf);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(
            @PathVariable Long id,
            @RequestBody @Valid UpdateTripRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Trip updatedTrip = tripService.updateTrip(id, request, userDetails.getUsername());
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        tripService.deleteTrip(id, username);
        return ResponseEntity.noContent().build();
    }
}
