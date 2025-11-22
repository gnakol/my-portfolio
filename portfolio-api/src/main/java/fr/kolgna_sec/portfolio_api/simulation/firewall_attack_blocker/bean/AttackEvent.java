package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.AttackType;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.Protocol;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.Severity;
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
@Table(name = "attack_event")
public class AttackEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_attack_event")
    private Long idAttackEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_session", nullable = false)
    private FirewallSession session;

    @Enumerated(EnumType.STRING)
    @Column(name = "attack_type", nullable = false)
    private AttackType attackType;

    @Column(name = "source_ip", nullable = false, length = 45)
    private String sourceIp;

    @Column(name = "source_country", length = 2)
    private String sourceCountry;

    @Column(name = "target_port", nullable = false)
    private Integer targetPort;

    @Enumerated(EnumType.STRING)
    @Column(name = "protocol", nullable = false)
    private Protocol protocol;

    @Column(name = "packet_size")
    private Integer packetSize;

    @Column(name = "requests_per_second")
    private Integer requestsPerSecond;

    @Column(name = "is_blocked")
    @Builder.Default
    private Boolean isBlocked = false;

    @Column(name = "blocked_by_rule")
    private String blockedByRule;

    @Column(name = "detected_at")
    private LocalDateTime detectedAt;

    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    @Builder.Default
    private Severity severity = Severity.MEDIUM;

    @PrePersist
    protected void onCreate() {
        if (detectedAt == null) {
            detectedAt = LocalDateTime.now();
        }
    }
}
