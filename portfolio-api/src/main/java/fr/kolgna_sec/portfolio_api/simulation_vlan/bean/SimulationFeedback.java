package fr.kolgna_sec.portfolio_api.simulation_vlan.bean;

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
@Table(name = "simulation_feedback", indexes = {
    @Index(name = "idx_session_id", columnList = "session_id")
})
public class SimulationFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private SimulationSession session;

    @Column(name = "experience_name", nullable = false, length = 255)
    private String experienceName;

    @Column(name = "feedback_type", nullable = false, length = 100)
    private String feedbackType;

    @Column(name = "feedback_value", nullable = false, columnDefinition = "TEXT")
    private String feedbackValue;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
