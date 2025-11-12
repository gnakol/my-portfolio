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
public class SaveFeedbackRequest {

    @NotBlank(message = "Nom de l'expérience requis")
    private String experienceName;

    @NotBlank(message = "Type de feedback requis")
    private String feedbackType;

    @NotBlank(message = "Valeur du feedback requise")
    private String feedbackValue;
}
