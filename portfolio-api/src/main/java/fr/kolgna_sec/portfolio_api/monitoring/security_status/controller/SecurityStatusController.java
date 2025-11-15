package fr.kolgna_sec.portfolio_api.monitoring.security_status.controller;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.bean.TlsSecurityScan;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.dto.SecurityStatusDTO;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.service.TlsCheckService;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.service.TlsSecurityScanner;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("security-status")
public class SecurityStatusController {

    private final TlsCheckService tlsCheckService;
    private final TlsSecurityScanner tlsSecurityScanner;

    @GetMapping("/status")
    public ResponseEntity<List<SecurityStatusDTO>> status() {
        var list = this.tlsCheckService.latestSnapshot().stream().map(s ->
                SecurityStatusDTO.builder()
                        .kind(s.getKind())
                        .target(s.getTarget())
                        .checkedAt(s.getCheckedAt())
                        .daysLeft(s.getDaysLeft())
                        .ok(s.getOk())
                        .message(s.getMessage())
                        .build()
        ).toList();
        return ResponseEntity.ok(list);
    }

    // pour forcer une vérif manuelle si besoin
    @PostMapping("/check-tls")
    public ResponseEntity<SecurityStatusDTO> checkNow(@RequestParam String hostPort) {
        var s = this.tlsCheckService.checkOne(hostPort.trim());
        return ResponseEntity.ok(SecurityStatusDTO.builder()
                .kind(s.getKind()).target(s.getTarget()).checkedAt(s.getCheckedAt())
                .daysLeft(s.getDaysLeft()).ok(s.getOk()).message(s.getMessage()).build());
    }

    /**
     * Récupère l'historique complet des checks TLS
     * GET /security-status/history
     */
    @GetMapping("/history")
    public ResponseEntity<List<SecurityStatusDTO>> history() {
        var history = this.tlsCheckService.getAllHistory().stream()
                .map(s -> SecurityStatusDTO.builder()
                        .kind(s.getKind())
                        .target(s.getTarget())
                        .checkedAt(s.getCheckedAt())
                        .daysLeft(s.getDaysLeft())
                        .ok(s.getOk())
                        .message(s.getMessage())
                        .build())
                .toList();
        return ResponseEntity.ok(history);
    }

    // ========== NOUVEAUX ENDPOINTS SCAN SÉCURITÉ AVANCÉ ==========

    /**
     * Lance un scan de sécurité SSL/TLS complet
     * POST /security-status/advanced-scan?hostPort=kolie-portfolio.org:443
     *
     * Analyse complète que Grafana/Prometheus ne peuvent PAS faire :
     * - Versions TLS supportées
     * - Cipher suites faibles/forts
     * - Vulnérabilités (POODLE, BEAST, etc.)
     * - Chaîne de certificats
     * - Score de sécurité A+ à F
     */
    @PostMapping("/advanced-scan")
    public ResponseEntity<TlsSecurityScan> performAdvancedScan(@RequestParam String hostPort) {
        TlsSecurityScan scan = tlsSecurityScanner.performSecurityScan(hostPort);
        return ResponseEntity.ok(scan);
    }

    /**
     * Récupère le dernier scan pour un domaine
     * GET /security-status/advanced-scan/latest?target=kolie-portfolio.org:443
     */
    @GetMapping("/advanced-scan/latest")
    public ResponseEntity<TlsSecurityScan> getLatestScan(@RequestParam String target) {
        return tlsSecurityScanner.getLatestScan(target)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Récupère tous les scans avancés (10 derniers)
     * GET /security-status/advanced-scan/all
     */
    @GetMapping("/advanced-scan/all")
    public ResponseEntity<List<TlsSecurityScan>> getAllScans() {
        List<TlsSecurityScan> scans = tlsSecurityScanner.getAllScans();
        return ResponseEntity.ok(scans);
    }

    /**
     * Récupère l'historique des scans pour un domaine spécifique
     * GET /security-status/advanced-scan/history?target=kolie-portfolio.org:443
     */
    @GetMapping("/advanced-scan/history")
    public ResponseEntity<List<TlsSecurityScan>> getScanHistory(@RequestParam String target) {
        List<TlsSecurityScan> history = tlsSecurityScanner.getScanHistory(target);
        return ResponseEntity.ok(history);
    }
}
