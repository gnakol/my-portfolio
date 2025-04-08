package fr.kolgna_sec.portfolio_api.contact.dto;

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

    private String email;

    private String telephone;

    private String message;
}
