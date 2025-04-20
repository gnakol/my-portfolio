package fr.kolgna_sec.portfolio_api.contact.bean;

import jakarta.persistence.*;
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
@Entity
@Table(name = "contact")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contact")
    private Long idContact;

    @Column(name = "email")
    @Email(message = "Adresse email invalide")
    @NotBlank(message = "L'email est requis")
    private String email;

    @Column(name = "telephone")
    @Pattern(
            regexp = "^\\+(?:[0-9] ?){6,14}[0-9]$",
            message = "Numéro de téléphone invalide"
    )
    private String telephone;

    @Column(name = "message")
    private String message;

}
