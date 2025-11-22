package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionResultDTO {
    private String sessionUuid;
    private Integer finalScore;
    private String grade;
    private Integer attacksBlocked;
    private Integer totalAttacks;
    private BigDecimal blockRate;
    private Integer durationSeconds;
    private BigDecimal moneySaved;
    private Integer rulesCreated;
    private Boolean isTop10;
    private Integer leaderboardRank;
}
