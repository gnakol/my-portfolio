package fr.kolgna_sec.portfolio_api.simulation_vlan.dto;

import fr.kolgna_sec.portfolio_api.simulation_vlan.enumeration.SimulationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StartSessionRequest {

    @NotNull(message = "Type de simulation requis")
    private SimulationType type;

    @NotBlank(message = "Client hash requis")
    private String clientHash;

    private String userAgent;
}
