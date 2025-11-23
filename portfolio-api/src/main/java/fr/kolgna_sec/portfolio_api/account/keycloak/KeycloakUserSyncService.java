package fr.kolgna_sec.portfolio_api.account.keycloak;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service de synchronisation automatique entre Keycloak et la DB
 *
 * Responsabilité :
 * - Créer automatiquement un Account en DB quand un user se connecte via Keycloak pour la 1ère fois
 * - Synchroniser les infos de base (email, nom, prénom) depuis le JWT
 */
@Service
@RequiredArgsConstructor
public class KeycloakUserSyncService {

    private final AccountRepository accountRepository;
    private final UuidService uuidService;

    /**
     * Synchronise l'utilisateur Keycloak avec la DB
     * Si l'utilisateur n'existe pas en DB, il est créé automatiquement
     *
     * @param jwt JWT Keycloak de l'utilisateur authentifié
     * @return L'Account synchronisé
     */
    public Account syncUserFromJwt(Jwt jwt) {
        String keycloakUserId = jwt.getSubject(); // UUID Keycloak
        String email = jwt.getClaimAsString("email");
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");

        // 1. Chercher par keycloakUserId
        Optional<Account> existingAccount = accountRepository.findByKeycloakUserId(keycloakUserId);

        if (existingAccount.isPresent()) {
            // L'utilisateur existe déjà, on le retourne
            return existingAccount.get();
        }

        // 2. Chercher par email (au cas où il existait avant la migration)
        Optional<Account> accountByEmail = accountRepository.findByEmail(email);

        if (accountByEmail.isPresent()) {
            // L'utilisateur existait en DB (ancienne méthode), on synchronise son keycloakUserId
            Account account = accountByEmail.get();
            account.setKeycloakUserId(keycloakUserId);
            return accountRepository.save(account);
        }

        // 3. Créer un nouveau compte en DB
        Account newAccount = new Account();
        newAccount.setRefAccount(uuidService.generateUuid());
        newAccount.setKeycloakUserId(keycloakUserId);
        newAccount.setEmail(email);
        newAccount.setFirstName(firstName);
        newAccount.setName(lastName);

        System.out.println("✅ Nouvel utilisateur synchronisé depuis Keycloak: " + email);

        return accountRepository.save(newAccount);
    }

    /**
     * Récupère l'Account correspondant à un JWT Keycloak
     *
     * @param jwt JWT Keycloak
     * @return L'Account ou vide si non trouvé
     */
    public Optional<Account> getAccountFromJwt(Jwt jwt) {
        String keycloakUserId = jwt.getSubject();
        return accountRepository.findByKeycloakUserId(keycloakUserId);
    }
}
