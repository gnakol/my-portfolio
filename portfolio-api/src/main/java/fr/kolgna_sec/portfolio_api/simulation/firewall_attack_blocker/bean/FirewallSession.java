package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.SessionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "firewall_session")
public class FirewallSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_session")
    private Long idSession;

    @Column(name = "session_uuid", nullable = false, unique = true, length = 36)
    private String sessionUuid;

    @Column(name = "visitor_ip", length = 45)
    private String visitorIp;

    @Column(name = "player_pseudo", length = 50)
    private String playerPseudo;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_status")
    @Builder.Default
    private SessionStatus sessionStatus = SessionStatus.IN_PROGRESS;

    @Column(name = "final_score")
    @Builder.Default
    private Integer finalScore = 0;

    @Column(name = "grade", length = 30)
    private String grade;

    @Column(name = "attacks_blocked")
    @Builder.Default
    private Integer attacksBlocked = 0;

    @Column(name = "total_attacks")
    @Builder.Default
    private Integer totalAttacks = 0;

    @Column(name = "rules_created")
    @Builder.Default
    private Integer rulesCreated = 0;

    @Column(name = "money_saved", precision = 10, scale = 2)
    private BigDecimal moneySaved;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AttackEvent> attackEvents = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }
}
