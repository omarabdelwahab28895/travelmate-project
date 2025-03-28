package com.travelmate.controller;

import com.travelmate.entity.ItineraryItem;
import com.travelmate.service.ItineraryItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itinerary")
@RequiredArgsConstructor
public class ItineraryItemController {

    private final ItineraryItemService itineraryItemService;

    // ➕ Aggiungi tappa
    @PostMapping("/{tripId}")
    public ResponseEntity<ItineraryItem> addItemToTrip(
            @PathVariable Long tripId,
            @RequestBody ItineraryItem item,
            @AuthenticationPrincipal UserDetails userDetails) {

        ItineraryItem savedItem = itineraryItemService.addItineraryItem(tripId, item, userDetails.getUsername());
        return ResponseEntity.ok(savedItem);
    }

    // 📋 Ottieni tutte le tappe di un viaggio
    @GetMapping("/{tripId}")
    public ResponseEntity<List<ItineraryItem>> getItemsForTrip(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ItineraryItem> items = itineraryItemService.getItemsForTrip(tripId, userDetails.getUsername());
        return ResponseEntity.ok(items);
    }

    // 🗑️ Elimina una tappa
    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails) {

        itineraryItemService.deleteItem(itemId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
