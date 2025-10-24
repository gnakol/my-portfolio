package fr.kolgna_sec.portfolio_api.monitoring.dashboard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.kolgna_sec.portfolio_api.monitoring.dashboard.dtos.DashboardDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardUpdateService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;
    private final DashboardDataService dashboardDataService; // ← SEULE dépendance métier

    @Scheduled(fixedRate = 10000)
    public void broadcastDashboardUpdate() {
        try {
            var dashboard = dashboardDataService.getCurrentDashboardData(); // ← Direct, propre
            if (dashboard != null) {
                messagingTemplate.convertAndSend("/topic/dashboard-updates", dashboard);
                log.debug("📡 WebSocket update envoyé");
            }
        } catch (Exception e) {
            log.warn("Erreur lors de l'envoi WebSocket: {}", e.getMessage());
        }
    }

    public void sendAlert(String message, String level) {
        var alert = java.util.Map.of(
                "type", "ALERT",
                "message", message,
                "level", level,
                "timestamp", java.time.Instant.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/alerts", alert);
    }
}