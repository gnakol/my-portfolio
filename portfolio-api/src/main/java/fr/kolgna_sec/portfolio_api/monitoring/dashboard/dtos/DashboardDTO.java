package fr.kolgna_sec.portfolio_api.monitoring.dashboard.dtos;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DashboardDTO {
    private SystemDTO system;
    private AvailabilityDTO availability;
    private SecurityDTO security;
    private MaintenanceDTO maintenance;

    @Data @Builder public static class SystemDTO {
        private Double cpuLoad;           // 0..1
        private Long heapUsedBytes;
        private Long heapMaxBytes;
        private Long totalDiskBytes;
        private Long freeDiskBytes;
    }

    @Data @Builder public static class AvailabilityDTO {
        private String checkedAt;
        private Long uptimeMs;
        private Integer errors5xxLast5m;
        private Integer errors5xxLast60m;
        private Boolean ok;
        private String message;
    }

    @Data @Builder public static class SecurityDTO {
        // résumé TLS (tu peux étendre plus tard)
        private java.util.List<TlsRow> tls;
        @Data @Builder public static class TlsRow {
            private String target;
            private Integer daysLeft;
            private Boolean ok;
            private String message;
            private String checkedAt;
        }
    }

    @Data @Builder public static class MaintenanceDTO {
        private String lastBackupAt;
        private Boolean lastBackupOk;
        private Long lastBackupSizeBytes;
        private String lastBackupFile;
    }
}

