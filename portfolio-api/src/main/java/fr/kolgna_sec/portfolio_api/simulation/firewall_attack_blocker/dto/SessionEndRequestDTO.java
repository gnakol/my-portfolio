package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionEndRequestDTO {
    private String sessionUuid;
    private Integer rating;
    private String feedback;
}
