package fr.kolgna_sec.portfolio_api.simulation_vlan.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SendCommandRequest {

    @NotBlank(message = "Commande requise")
    private String rawCommand;
}
