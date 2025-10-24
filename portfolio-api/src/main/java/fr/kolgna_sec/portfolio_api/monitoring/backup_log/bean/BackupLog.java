package fr.kolgna_sec.portfolio_api.monitoring.backup_log.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

// entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "backup_log")
public class BackupLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="ran_at", nullable=false)
    private Instant ranAt;
    @Column(name="ok", nullable=false)
    private Boolean ok;
    @Column(name="duration_ms")
    private Long durationMs;
    @Column(name="file_path")
    private String filePath;
    @Column(name="size_bytes")
    private Long sizeBytes;
    @Column(name="message")
    private String message;
}
