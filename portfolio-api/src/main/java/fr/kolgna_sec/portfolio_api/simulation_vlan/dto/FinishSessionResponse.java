package fr.kolgna_sec.portfolio_api.simulation_vlan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FinishSessionResponse {
    private Integer score;
    private Long durationMs;
    private Boolean success;
}
