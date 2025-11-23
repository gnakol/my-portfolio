package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import java.nio.file.FileStore;
import java.nio.file.FileSystems;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemHealthService {

    private final SystemHealthRepository repository;

    @Data @Builder
    public static class SystemHealthDTO {
        private Double systemCpuLoad;   // 0..1, peut être null si indispo
        private Long heapUsedBytes;
        private Long heapMaxBytes;
        private Long totalDiskBytes;
        private Long freeDiskBytes;
    }

    public SystemHealthDTO snapshot() {
        // CPU (peut retourner -1 juste après le démarrage)
        Double cpu = null;
        try {
            var os = (com.sun.management.OperatingSystemMXBean)
                    ManagementFactory.getOperatingSystemMXBean();
            double v = os.getSystemCpuLoad();   // 0..1, -1 si inconnu
            cpu = (v >= 0 ? v : null);
        } catch (Throwable ignored) {
            // JVM non-Oracle/OpenJDK -> garde null
        }

        // Heap
        MemoryMXBean mem = ManagementFactory.getMemoryMXBean();
        MemoryUsage heap = mem.getHeapMemoryUsage();

        // Disque (agrège tous les FileStore)
        long total = 0L, free = 0L;
        try {
            for (FileStore fs : FileSystems.getDefault().getFileStores()) {
                total += fs.getTotalSpace();
                free  += fs.getUsableSpace();
            }
        } catch (Exception ignored) {}

        return SystemHealthDTO.builder()
                .systemCpuLoad(cpu)
                .heapUsedBytes(heap.getUsed())
                .heapMaxBytes(heap.getMax())
                .totalDiskBytes(total)
                .freeDiskBytes(free)
                .build();
    }

    // ========== NOUVELLES MÉTHODES ==========

    /**
     * Persiste un snapshot système (appelé par scheduled task)
     */
    @Transactional
    public SystemHealthSnapshot saveSnapshot() {
        SystemHealthDTO current = snapshot();

        SystemHealthSnapshot snap = SystemHealthSnapshot.builder()
                .timestamp(Instant.now())
                .cpuLoad(current.getSystemCpuLoad())
                .heapUsedBytes(current.getHeapUsedBytes())
                .heapMaxBytes(current.getHeapMaxBytes())
                .totalDiskBytes(current.getTotalDiskBytes())
                .freeDiskBytes(current.getFreeDiskBytes())
                .build();

        return repository.save(snap);
    }

    /**
     * Récupère la timeline des métriques (X dernières heures)
     */
    @Transactional(readOnly = true)
    public List<SystemHealthDTO> getTimeline(int hours) {
        Instant since = Instant.now().minus(Duration.ofHours(hours));
        List<SystemHealthSnapshot> snapshots = repository.findByTimestampAfterOrderByTimestampAsc(since);

        return snapshots.stream()
                .map(s -> SystemHealthDTO.builder()
                        .systemCpuLoad(s.getCpuLoad())
                        .heapUsedBytes(s.getHeapUsedBytes())
                        .heapMaxBytes(s.getHeapMaxBytes())
                        .totalDiskBytes(s.getTotalDiskBytes())
                        .freeDiskBytes(s.getFreeDiskBytes())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Purge les snapshots trop anciens
     */
    @Transactional
    public int purgeOldSnapshots(int days) {
        if (days < 0) {
            throw new IllegalArgumentException("Days must be positive");
        }

        Instant cutoff = Instant.now().minus(Duration.ofDays(days));
        List<SystemHealthSnapshot> oldSnapshots = repository.findByTimestampAfterOrderByTimestampAsc(cutoff);
        int count = oldSnapshots.size();

        repository.deleteByTimestampBefore(cutoff);
        return count;
    }

    /**
     * Snapshot automatique toutes les 5 minutes
     */
    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void scheduledSnapshot() {
        saveSnapshot();
        // Auto-purge > 7 jours
        purgeOldSnapshots(7);
    }
}


