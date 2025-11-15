package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("system-health")
@RequiredArgsConstructor
public class SystemHealthController {

    private final SystemHealthService service;
    private final PrometheusMetricsService prometheusService;

    /**
     * Récupère le snapshot système actuel
     */
    @GetMapping("/status")
    public ResponseEntity<SystemHealthService.SystemHealthDTO> status() {
        return ResponseEntity.ok(service.snapshot());
    }

    /**
     * Récupère la timeline des métriques système (X dernières heures)
     * GET /system-health/timeline?hours=24
     */
    @GetMapping("/timeline")
    public ResponseEntity<List<SystemHealthService.SystemHealthDTO>> timeline(
            @RequestParam(defaultValue = "24") int hours
    ) {
        if (hours < 1 || hours > 168) { // Max 7 jours
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<SystemHealthService.SystemHealthDTO> timeline = service.getTimeline(hours);
        return ResponseEntity.ok(timeline);
    }

    /**
     * Purge les snapshots trop anciens
     * DELETE /system-health/snapshots/older-than/{days}
     */
    @DeleteMapping("/snapshots/older-than/{days}")
    public ResponseEntity<Map<String, Object>> purgeOldSnapshots(@PathVariable int days) {
        if (days < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        int deletedCount = service.purgeOldSnapshots(days);
        return ResponseEntity.ok(Map.of(
                "deletedCount", deletedCount,
                "message", deletedCount + " snapshot(s) supprimé(s)"
        ));
    }

    /**
     * Récupère les métriques Kubernetes depuis Prometheus
     * GET /system-health/k8s-metrics
     */
    @GetMapping("/k8s-metrics")
    public ResponseEntity<Map<String, Object>> getKubernetesMetrics() {
        int podsCount = prometheusService.getPodsCount();
        long totalRamBytes = prometheusService.getTotalPodsRamBytes();

        return ResponseEntity.ok(Map.of(
                "podsCount", podsCount,
                "totalRamBytes", totalRamBytes,
                "totalRamMB", totalRamBytes / (1024 * 1024),
                "totalRamGB", String.format("%.2f", totalRamBytes / (1024.0 * 1024.0 * 1024.0))
        ));
    }
}

