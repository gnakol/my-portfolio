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
public class LeaderboardEntryDTO {
    private Integer rank;
    private String playerPseudo;
    private Integer finalScore;
    private String grade;
    private BigDecimal blockRate;
    private Integer completionTimeSeconds;
    private String achievedAt;
}
