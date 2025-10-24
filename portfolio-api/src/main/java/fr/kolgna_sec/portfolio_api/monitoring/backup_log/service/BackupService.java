package fr.kolgna_sec.portfolio_api.monitoring.backup_log.service;

import fr.kolgna_sec.portfolio_api.monitoring.backup_log.bean.BackupLog;
import fr.kolgna_sec.portfolio_api.monitoring.backup_log.repositories.BackupLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.net.URI;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BackupService {
    private final BackupLogRepository repo;

    @Value("${spring.datasource.url}")
    private String jdbcUrl;
    @Value("${spring.datasource.username}")
    private String user;
    @Value("${spring.datasource.password}")
    private String pass;
    @Value("${backup.scheduled:true}")
    private boolean backupScheduled;
    @Value("${backup.dir:/tmp}")
    private String backupDir;

    @Value("${backup.retentionDays:7}")
    private int retentionDays;


    public BackupLog runNow() throws IOException {
        Instant start = Instant.now();

        // --- Parse de l’URL JDBC ---
        // ex: jdbc:mysql://localhost:3306/portfolio_db?useSSL=false
        String url = jdbcUrl.replace("jdbc:", "");
        URI uri = URI.create(url);
        String host = (uri.getHost() != null) ? uri.getHost() : "127.0.0.1";
        if ("localhost".equalsIgnoreCase(host)) {
            host = "127.0.0.1";   // IMPORTANT : éviter la socket UNIX
        }
        int port = (uri.getPort() > 0) ? uri.getPort() : 3306;
        String db   = uri.getPath().replaceFirst("^/", "").split("\\?")[0];

        // Fichier de sortie
        Path out = Path.of(backupDir, "backup-" + db + "-" + System.currentTimeMillis() + ".sql");
        Files.createDirectories(out.getParent());

        try {
            // --- Commande mysqldump sans shell, avec chemin absolu ---
            ProcessBuilder pb = new ProcessBuilder(
                    "/usr/bin/mysqldump",        // chemin absolu
                    "-h", host,
                    "-P", String.valueOf(port),
                    "-u", user,
                    "--single-transaction",
                    "--no-tablespaces",
                    db
            );

            // Passe le mot de passe par l'ENV (évite l’invite interactive)
            pb.environment().put("MYSQL_PWD", pass);

            // On fusionne stderr→stdout pour pouvoir logguer les erreurs
            pb.redirectErrorStream(true);

            Process p = pb.start();

            // Écrit le dump directement dans le fichier
            Files.createDirectories(out.getParent());
            try (InputStream in = p.getInputStream()) {
                Files.copy(in, out);
            }

            int code = p.waitFor();
            long size = Files.exists(out) ? Files.size(out) : 0L;

            String message = (code == 0 && size > 0)
                    ? "Backup OK"
                    : "Backup failed, code=" + code;

            BackupLog log = BackupLog.builder()
                    .ranAt(Instant.now())
                    .ok(code == 0 && size > 0)
                    .durationMs(Duration.between(start, Instant.now()).toMillis())
                    .filePath(out.toString())
                    .sizeBytes(size)
                    .message(message)
                    .build();

            return repo.save(log);
        } catch (Exception e) {
            BackupLog log = BackupLog.builder()
                    .ranAt(Instant.now())
                    .ok(false)
                    .durationMs(Duration.between(start, Instant.now()).toMillis())
                    .filePath(out.toString())
                    .sizeBytes(null)
                    .message("Error: " + e.getClass().getSimpleName() + ": " + e.getMessage())
                    .build();
             repo.save(log);
             purgeOldBackups(db);
             return log;
        }
    }

    public Optional<BackupLog> last() {
        return repo.findTopByOrderByRanAtDesc();
    }

    @Scheduled(cron = "0 0 2 * * *")
    public void scheduledBackup() throws IOException {
        if (!backupScheduled) return;
        runNow();
    }

    private void purgeOldBackups(String db) {
        if (retentionDays <= 0) return; // 0 ou négatif => désactivé
        Instant cutoff = Instant.now().minus(Duration.ofDays(retentionDays));

        // 3.1 — Purge des fichiers /tmp/backup-<db>-*.sql plus vieux que 'cutoff'
        try {
            Path dir = Path.of(backupDir);
            if (Files.isDirectory(dir)) {
                Files.list(dir)
                        .filter(p -> {
                            String fn = p.getFileName().toString();
                            return fn.startsWith("backup-" + db + "-") && fn.endsWith(".sql");
                        })
                        .filter(p -> {
                            try {
                                return Files.getLastModifiedTime(p).toInstant().isBefore(cutoff);
                            } catch (Exception e) {
                                log.warn("mtime read failed for {}: {}", p, e.getMessage());
                                return false;
                            }
                        })
                        .forEach(p -> {
                            try {
                                Files.deleteIfExists(p);
                                log.info("Deleted old backup file: {}", p);
                            } catch (Exception e) {
                                log.warn("Cannot delete {}: {}", p, e.getMessage());
                            }
                        });
            }
        } catch (Exception e) {
            log.warn("Purge files error: {}", e.getMessage());
        }

        // 3.2 — Purge des lignes trop anciennes en DB
        try {
            int n = repo.deleteByRanAtBefore(cutoff);
            if (n > 0) log.info("Deleted {} old backup_log rows (<= {})", n, cutoff);
        } catch (Exception e) {
            log.warn("Purge DB rows error: {}", e.getMessage());
        }
    }

}

