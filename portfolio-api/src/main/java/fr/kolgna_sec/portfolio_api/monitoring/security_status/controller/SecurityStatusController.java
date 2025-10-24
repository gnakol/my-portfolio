package fr.kolgna_sec.portfolio_api.monitoring.security_status.controller;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.dto.SecurityStatusDTO;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.service.TlsCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("security-status")
public class SecurityStatusController {

    private final TlsCheckService tlsCheckService;

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
}
