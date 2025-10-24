package fr.kolgna_sec.portfolio_api.monitoring.availability_status.service;


import fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean.AvailabilityStatus;
import fr.kolgna_sec.portfolio_api.monitoring.availability_status.repositories.AvailabilityStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilityStatusRepository repo;
    private final ErrorCountingFilter errorFilter;

    @Value("${availability.retentionDays:7}")
    private int retentionDays;

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

    private void purgeOld() {
        if (retentionDays <= 0) return;
        Instant cutoff = Instant.now().minus(Duration.ofDays(retentionDays));
        repo.deleteByCheckedAtBefore(cutoff);
    }

    /** Exemple : snapshot toutes les 5 min (désactive si tu veux) */
    @Scheduled(cron = "0 */5 * * * *")
    public void scheduledCheck() {
        checkNow();
    }
}

