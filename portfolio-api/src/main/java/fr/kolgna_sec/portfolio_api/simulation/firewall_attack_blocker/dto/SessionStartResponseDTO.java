package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionStartResponseDTO {
    private String sessionUuid;
    private LocalDateTime startedAt;
    private String scenario;
    private List<AttackEventDTO> initialAttacks;
}
