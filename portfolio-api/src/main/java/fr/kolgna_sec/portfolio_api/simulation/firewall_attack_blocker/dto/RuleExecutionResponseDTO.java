package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RuleExecutionResponseDTO {
    private Boolean success;
    private String message;
    private Integer attacksBlocked;
    private Integer scoreGained;
    private Integer currentScore;
    private List<Long> blockedAttackIds;
}
