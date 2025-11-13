package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "system_health_snapshots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemHealthSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Instant timestamp;

    private Double cpuLoad;        // 0..1
    private Long heapUsedBytes;
    private Long heapMaxBytes;
    private Long totalDiskBytes;
    private Long freeDiskBytes;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }
}
