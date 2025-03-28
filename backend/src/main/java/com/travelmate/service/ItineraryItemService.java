package com.travelmate.service;

import com.travelmate.entity.ItineraryItem;
import com.travelmate.entity.Trip;
import com.travelmate.repository.ItineraryItemRepository;
import com.travelmate.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryItemService {

    private final ItineraryItemRepository itineraryItemRepository;
    private final TripRepository tripRepository;

    public ItineraryItem addItineraryItem(Long tripId, ItineraryItem item, String username) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Viaggio non trovato"));

        if (!trip.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato ad aggiungere tappe a questo viaggio");
        }

        item.setTrip(trip);
        return itineraryItemRepository.save(item);
    }

    public List<ItineraryItem> getItemsForTrip(Long tripId, String username) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Viaggio non trovato"));

        if (!trip.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato a visualizzare le tappe di questo viaggio");
        }

        return itineraryItemRepository.findByTripId(tripId);
    }

    public void deleteItem(Long itemId, String username) {
        ItineraryItem item = itineraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Tappa non trovata"));

        if (!item.getTrip().getUser().getUsername().equals(username)) {
            throw new RuntimeException("Non sei autorizzato a eliminare questa tappa");
        }

        itineraryItemRepository.delete(item);
    }
}
