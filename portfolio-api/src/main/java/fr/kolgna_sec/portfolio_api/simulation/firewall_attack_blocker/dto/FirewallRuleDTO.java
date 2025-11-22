package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FirewallRuleDTO {
    private String sessionUuid;
    private String ruleCommand;
    private String ruleType; // "block", "allow", "rate-limit", "drop"
    private String targetIp;
    private Integer targetPort;
    private String protocol;
}
