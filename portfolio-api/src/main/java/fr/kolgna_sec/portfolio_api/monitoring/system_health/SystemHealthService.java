package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;
import java.nio.file.FileStore;
import java.nio.file.FileSystems;

@Service
public class SystemHealthService {

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
}

