package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("system-health")
@RequiredArgsConstructor
public class SystemHealthController {

    private final SystemHealthService service;

    @GetMapping("/status")
    public ResponseEntity<SystemHealthService.SystemHealthDTO> status() {
        return ResponseEntity.ok(service.snapshot());
    }
}

