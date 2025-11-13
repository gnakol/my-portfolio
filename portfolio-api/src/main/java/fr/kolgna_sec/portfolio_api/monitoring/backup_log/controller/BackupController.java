package fr.kolgna_sec.portfolio_api.monitoring.backup_log.controller;

import fr.kolgna_sec.portfolio_api.monitoring.backup_log.bean.BackupLog;
import fr.kolgna_sec.portfolio_api.monitoring.backup_log.service.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("maintenance")
@RequiredArgsConstructor
public class BackupController {
    private final BackupService service;

    @PostMapping("/backup/run")
    public ResponseEntity<BackupLog> run() throws IOException {
        return ResponseEntity.ok(service.runNow());
    }

    @GetMapping("/backup/last")
    public ResponseEntity<BackupLog> last() {
        return ResponseEntity.of(service.last());
    }

    /**
     * Purge les logs/backups antérieurs à X jours
     * DELETE /maintenance/logs/older-than/{days}
     */
    @DeleteMapping("/logs/older-than/{days}")
    public ResponseEntity<Map<String, Object>> purgeLogs(@PathVariable int days) {
        if (days < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        int deletedCount = service.purgeOldBackups(days);
        return ResponseEntity.ok(Map.of(
                "deletedCount", deletedCount,
                "message", deletedCount + " backup log(s) supprimé(s)"
        ));
    }
}

