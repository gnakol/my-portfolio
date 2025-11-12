package fr.kolgna_sec.portfolio_api.simulation_vlan.bean;

import fr.kolgna_sec.portfolio_api.simulation_vlan.enumeration.CommandStatus;
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
@Table(name = "simulation_command", indexes = {
    @Index(name = "idx_session_id", columnList = "session_id")
})
public class SimulationCommand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SimulationSession session;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "raw_command", nullable = false, length = 512)
    private String rawCommand;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CommandStatus status;

    @Column(name = "step_index")
    private Integer stepIndex;

    @Column(name = "note", length = 1024)
    private String note;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
