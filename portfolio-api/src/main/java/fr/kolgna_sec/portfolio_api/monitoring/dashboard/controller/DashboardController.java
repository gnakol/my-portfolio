package fr.kolgna_sec.portfolio_api.monitoring.dashboard.controller;

import fr.kolgna_sec.portfolio_api.monitoring.dashboard.dtos.DashboardDTO;
import fr.kolgna_sec.portfolio_api.monitoring.dashboard.service.DashboardDataService;
import fr.kolgna_sec.portfolio_api.monitoring.dashboard.service.DashboardUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardUpdateService updateService;
    private final DashboardDataService dashboardDataService;

    @GetMapping("/status")
    public ResponseEntity<DashboardDTO> status() {
        var dashboard = dashboardDataService.getCurrentDashboardData();
        updateService.broadcastDashboardUpdate(); // Optionnel mais utile
        return ResponseEntity.ok(dashboard);
    }
}