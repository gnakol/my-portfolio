package fr.kolgna_sec.portfolio_api.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactDTO {

    private Long idContact;

    @Email(message = "Adresse email invalide")
    @NotBlank(message = "L'email est requis")
    private String email;

    @Pattern(
            regexp = "^\\+(?:[0-9] ?){6,14}[0-9]$",
            message = "Numéro de téléphone invalide"
    )
    private String telephone;

    private String message;
}
