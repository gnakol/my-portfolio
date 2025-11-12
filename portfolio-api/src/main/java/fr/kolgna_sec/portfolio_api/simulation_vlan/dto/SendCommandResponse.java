package fr.kolgna_sec.portfolio_api.simulation_vlan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SendCommandResponse {
    private String status; // "OK" or "KO"
    private Integer stepIndex;
    private String message;
    private String animationCue;
}
