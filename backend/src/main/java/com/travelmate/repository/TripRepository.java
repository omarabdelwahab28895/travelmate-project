package com.travelmate.repository;

import com.travelmate.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserUsernameOrderByStartDateAsc(String username);
    List<Trip> findByUserUsernameAndDestinationContainingIgnoreCaseOrderByStartDateAsc(String username, String destination);
    long countByUserUsername(String username);
}
