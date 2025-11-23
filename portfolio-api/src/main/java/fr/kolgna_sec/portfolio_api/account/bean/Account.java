package fr.kolgna_sec.portfolio_api.account.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité Account - Données métier de l'utilisateur
 *
 * - L'authentification est gérée par Keycloak
 * - Les données métier (profile, CV, S3, etc.) restent en DB
 * - keycloakUserId fait le lien avec Keycloak
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_account")
    private Long idAccount;

    @Column(name = "ref_account")
    private String refAccount;

    /**
     * UUID de l'utilisateur dans Keycloak (clé de liaison)
     */
    @Column(name = "keycloak_user_id", unique = true)
    private String keycloakUserId;

    @Column(name = "name")
    private String name;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone_number")
    private Long phoneNumber;

    @Column(name = "civility")
    private String civility;

    @Column(name = "github")
    private String github;

    @Column(name = "linkedin")
    private String linkedin;

    @Column(name = "address")
    private String address;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "cv_url")
    private String cvUrl;
}
