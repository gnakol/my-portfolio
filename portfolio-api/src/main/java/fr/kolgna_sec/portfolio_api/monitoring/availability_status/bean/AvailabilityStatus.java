package fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "availability_status")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class AvailabilityStatus {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "checked_at", nullable = false)
    private Instant checkedAt;

    @Column(name = "uptime_ms", nullable = false)
    private Long uptimeMs;

    @Column(name = "errors_5xx_last5m", nullable = false)
    private Integer errors5xxLast5m;

    @Column(name = "errors_5xx_last60m", nullable = false)
    private Integer errors5xxLast60m;

    @Column(name = "ok", nullable = false)
    private Boolean ok;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;
}

