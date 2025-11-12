package fr.kolgna_sec.portfolio_api.simulation_vlan.bean;

import fr.kolgna_sec.portfolio_api.simulation_vlan.enumeration.SimulationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "simulation_session")
public class SimulationSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private SimulationType type;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @Column(name = "client_hash", nullable = false, length = 64)
    private String clientHash;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "score")
    private Integer score;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "success")
    private Boolean success;

    @PrePersist
    protected void onCreate() {
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }
}
