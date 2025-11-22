package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "player_score")
public class PlayerScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_player_score")
    private Long idPlayerScore;

    @OneToOne
    @JoinColumn(name = "id_session", nullable = false, unique = true)
    private FirewallSession session;

    @Column(name = "player_pseudo", nullable = false, length = 50)
    @Builder.Default
    private String playerPseudo = "Anonymous";

    @Column(name = "final_score", nullable = false)
    private Integer finalScore;

    @Column(name = "grade", nullable = false, length = 30)
    private String grade;

    @Column(name = "completion_time_seconds", nullable = false)
    private Integer completionTimeSeconds;

    @Column(name = "attacks_blocked", nullable = false)
    private Integer attacksBlocked;

    @Column(name = "total_attacks", nullable = false)
    private Integer totalAttacks;

    @Column(name = "block_rate", precision = 5, scale = 2)
    private BigDecimal blockRate;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "achieved_at")
    private LocalDateTime achievedAt;

    @Column(name = "is_top_10")
    @Builder.Default
    private Boolean isTop10 = false;

    @PrePersist
    protected void onCreate() {
        if (achievedAt == null) {
            achievedAt = LocalDateTime.now();
        }
    }
}
