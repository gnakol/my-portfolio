package fr.kolgna_sec.portfolio_api.monitoring.dashboard.service;

import fr.kolgna_sec.portfolio_api.monitoring.availability_status.service.AvailabilityService;
import fr.kolgna_sec.portfolio_api.monitoring.backup_log.service.BackupService;
import fr.kolgna_sec.portfolio_api.monitoring.dashboard.dtos.DashboardDTO;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.service.TlsCheckService;
import fr.kolgna_sec.portfolio_api.monitoring.system_health.SystemHealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardDataService {

    private final SystemHealthService system;
    private final AvailabilityService availability;
    private final BackupService backup;
    private final TlsCheckService tls;

    public DashboardDTO getCurrentDashboardData() {
        var sys = system.snapshot();
        var avail = availability.latest();

        var sec = tls.latestSnapshot().stream().map(s ->
                DashboardDTO.SecurityDTO.TlsRow.builder()
                        .target(s.getTarget())
                        .daysLeft(s.getDaysLeft())
                        .ok(Boolean.TRUE.equals(s.getOk()))
                        .message(s.getMessage())
                        .checkedAt(s.getCheckedAt().toString())
                        .build()
        ).toList();

        var last = backup.last().orElse(null);

        return DashboardDTO.builder()
                .system(
                        DashboardDTO.SystemDTO.builder()
                                .cpuLoad(sys.getSystemCpuLoad())
                                .heapUsedBytes(sys.getHeapUsedBytes())
                                .heapMaxBytes(sys.getHeapMaxBytes())
                                .totalDiskBytes(sys.getTotalDiskBytes())
                                .freeDiskBytes(sys.getFreeDiskBytes())
                                .build()
                )
                .availability(avail == null ? null :
                        DashboardDTO.AvailabilityDTO.builder()
                                .checkedAt(avail.getCheckedAt().toString())
                                .uptimeMs(avail.getUptimeMs())
                                .errors5xxLast5m(avail.getErrors5xxLast5m())
                                .errors5xxLast60m(avail.getErrors5xxLast60m())
                                .ok(avail.getOk())
                                .message(avail.getMessage())
                                .build()
                )
                .security(DashboardDTO.SecurityDTO.builder().tls(sec).build())
                .maintenance(last == null ? null :
                        DashboardDTO.MaintenanceDTO.builder()
                                .lastBackupAt(last.getRanAt().toString())
                                .lastBackupOk(last.getOk())
                                .lastBackupSizeBytes(last.getSizeBytes())
                                .lastBackupFile(last.getFilePath())
                                .build()
                )
                .build();
    }
}
