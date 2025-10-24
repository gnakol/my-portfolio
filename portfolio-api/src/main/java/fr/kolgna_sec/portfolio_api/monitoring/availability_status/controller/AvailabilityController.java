package fr.kolgna_sec.portfolio_api.monitoring.availability_status.controller;

import fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean.AvailabilityStatus;
import fr.kolgna_sec.portfolio_api.monitoring.availability_status.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService service;

    @PostMapping("/check")
    public ResponseEntity<AvailabilityStatus> check() {
        return ResponseEntity.ok(service.checkNow());
    }

    @GetMapping("/status")
    public ResponseEntity<AvailabilityStatus> status() {
        var latest = service.latest();
        return (latest == null) ? ResponseEntity.noContent().build() : ResponseEntity.ok(latest);
    }
}

