package fr.kolgna_sec.portfolio_api.account.dto;

import lombok.Builder;
import lombok.Data;

/**
 * AccountDTO - Données métier de l'utilisateur
 *
 * IMPORTANT : Après migration Keycloak :
 * - password et roles supprimés (gérés par Keycloak)
 * - Contient uniquement les données métier
 */
@Data
@Builder
public class AccountDTO {

    private Long idAccount;

    private String refAccount;

    private String keycloakUserId;

    private String name;

    private String firstName;

    private String email;

    private Long phoneNumber;

    private String civility;

    private String github;

    private String linkedin;

    private String address;

    private String profileImageUrl;

    private String cvUrl;
}
