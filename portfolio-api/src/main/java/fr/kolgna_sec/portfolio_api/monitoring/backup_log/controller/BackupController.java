package fr.kolgna_sec.portfolio_api.monitoring.backup_log.controller;

import fr.kolgna_sec.portfolio_api.monitoring.backup_log.bean.BackupLog;
import fr.kolgna_sec.portfolio_api.monitoring.backup_log.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("maintenance/backup")
@RequiredArgsConstructor
public class BackupController {
    private final BackupService service;

    @PostMapping("/run")
    public ResponseEntity<BackupLog> run() throws IOException {
        return ResponseEntity.ok(service.runNow());
    }

    @GetMapping("/last")
    public ResponseEntity<BackupLog> last() {
        return ResponseEntity.of(service.last());
    }
}

