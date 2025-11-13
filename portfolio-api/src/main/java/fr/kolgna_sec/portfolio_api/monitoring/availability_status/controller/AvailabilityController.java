package fr.kolgna_sec.portfolio_api.monitoring.availability_status.controller;

import fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean.AvailabilityStatus;
import fr.kolgna_sec.portfolio_api.monitoring.availability_status.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    /**
     * Récupère les stats SLA (uptime %, erreurs, etc.)
     * GET /availability/sla?days=30
     */
    @GetMapping("/sla")
    public ResponseEntity<AvailabilityService.SLAStatsDTO> sla(
            @RequestParam(defaultValue = "30") int days
    ) {
        if (days < 1 || days > 365) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        AvailabilityService.SLAStatsDTO stats = service.calculateSLA(days);
        return ResponseEntity.ok(stats);
    }
}

