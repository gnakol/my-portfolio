package fr.kolgna_sec.portfolio_api.simulation_vlan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StartSessionResponse {
    private Long sessionId;
    private String startedAt;
}
