package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttackEventDTO {
    private Long id;
    private String attackType;
    private String sourceIp;
    private String sourceCountry;
    private Integer targetPort;
    private String protocol;
    private Integer requestsPerSecond;
    private String severity;
    private Boolean isBlocked;
    private String detectedAt;
}
