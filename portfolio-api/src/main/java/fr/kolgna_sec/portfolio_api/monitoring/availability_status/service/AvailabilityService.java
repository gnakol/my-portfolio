package fr.kolgna_sec.portfolio_api.monitoring.availability_status.service;


import fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean.AvailabilityStatus;
import fr.kolgna_sec.portfolio_api.monitoring.availability_status.repositories.AvailabilityStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilityStatusRepository repo;
    private final ErrorCountingFilter errorFilter;

    @Value("${availability.retentionDays:7}")
    private int retentionDays;

    @Transactional
    public AvailabilityStatus checkNow() {
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        int e5  = errorFilter.countLastMinutes(5);
        int e60 = errorFilter.countLastMinutes(60);

        boolean ok = (e5 == 0);
        String msg = ok ? "No 5xx in last 5 minutes" :
                ("Errors 5xx: last5m=" + e5 + ", last60m=" + e60);

        AvailabilityStatus s = AvailabilityStatus.builder()
                .checkedAt(Instant.now())
                .uptimeMs(uptimeMs)
                .errors5xxLast5m(e5)
                .errors5xxLast60m(e60)
                .ok(ok)
                .message(msg)
                .build();

        AvailabilityStatus saved = repo.save(s);
        purgeOld();
        return saved;
    }

    public AvailabilityStatus latest() {
        return repo.findTopByOrderByCheckedAtDesc().orElse(null);
    }

    @Transactional
    private void purgeOld() {
        if (retentionDays <= 0) return;
        Instant cutoff = Instant.now().minus(Duration.ofDays(retentionDays));
        repo.deleteByCheckedAtBefore(cutoff);
    }

    /** Exemple : snapshot toutes les 5 min */
    @Transactional
    @Scheduled(cron = "0 */5 * * * *")

    public void scheduledCheck() {
        checkNow();
    }

    /**
     * Calcule les stats SLA (uptime %, erreurs, etc.)
     */
    public SLAStatsDTO calculateSLA(int days) {
        Instant since = Instant.now().minus(Duration.ofDays(days));
        List<AvailabilityStatus> snapshots = repo.findByCheckedAtAfter(since);

        if (snapshots.isEmpty()) {
            return SLAStatsDTO.builder()
                    .uptimePercent(0.0)
                    .totalChecks(0)
                    .okChecks(0)
                    .totalErrors5xx(0)
                    .build();
        }

        int totalChecks = snapshots.size();
        int okChecks = (int) snapshots.stream().filter(AvailabilityStatus::getOk).count();
        int totalErrors = snapshots.stream().mapToInt(AvailabilityStatus::getErrors5xxLast5m).sum();

        double uptimePercent = (okChecks * 100.0) / totalChecks;

        return SLAStatsDTO.builder()
                .uptimePercent(uptimePercent)
                .totalChecks(totalChecks)
                .okChecks(okChecks)
                .totalErrors5xx(totalErrors)
                .build();
    }

    /**
     * DTO pour les stats SLA
     */
    @lombok.Data
    @lombok.Builder
    public static class SLAStatsDTO {
        private Double uptimePercent;
        private Integer totalChecks;
        private Integer okChecks;
        private Integer totalErrors5xx;
    }
}

