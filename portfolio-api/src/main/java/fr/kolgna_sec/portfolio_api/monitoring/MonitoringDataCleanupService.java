package fr.kolgna_sec.portfolio_api.monitoring;

import fr.kolgna_sec.portfolio_api.monitoring.availability_status.repositories.AvailabilityStatusRepository;
import fr.kolgna_sec.portfolio_api.monitoring.backup_log.repositories.BackupLogRepository;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.repositories.SecurityStatusRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MonitoringDataCleanupService {

    private final AvailabilityStatusRepository availabilityRepo;
    private final SecurityStatusRepository securityRepo;
    private final BackupLogRepository backupRepo;

    @Value("${monitoring.retention.availability.detailed-hours:24}")
    private int availabilityDetailedHours;

    @Value("${monitoring.retention.security.detailed-days:7}")
    private int securityDetailedDays;

    @Value("${monitoring.retention.backup.logs-days:30}")
    private int backupLogsDays;

    /**
     * Nettoie les vieilles données de monitoring
     * Planifié tous les jours à 2h du matin
     */
    @Scheduled(cron = "0 09 17 * * *") // Tous les jours à 2h
    @Transactional
    public void cleanupOldMonitoringData() {
        log.info("🧹 Starting monitoring data cleanup...");

        int availabilityDeleted = cleanupAvailabilityData();
        int securityDeleted = cleanupSecurityData();
        int backupDeleted = cleanupBackupData();

        log.info("✅ Cleanup completed - Availability: {} deleted, Security: {} deleted, Backup: {} deleted",
                availabilityDeleted, securityDeleted, backupDeleted);
    }

    private int cleanupAvailabilityData() {
        Instant cutoff = Instant.now().minus(availabilityDetailedHours, ChronoUnit.HOURS);
        return availabilityRepo.deleteByCheckedAtBefore(cutoff);
    }

    private int cleanupSecurityData() {
        Instant cutoff = Instant.now().minus(securityDetailedDays, ChronoUnit.DAYS);
        return securityRepo.deleteByCheckedAtBefore(cutoff);
    }

    private int cleanupBackupData() {
        Instant cutoff = Instant.now().minus(backupLogsDays, ChronoUnit.DAYS);
        return backupRepo.deleteByRanAtBefore(cutoff);
    }

    /**
     * Méthode optionnelle pour agréger les données avant suppression
     * (Plus avancé - pour garder des trends long terme)
     */
    public void aggregateHistoricalData() {
        // Implémentation pour créer des données agrégées (moyennes horaires/journières)
        // Avant de supprimer les données détaillées
    }
}
