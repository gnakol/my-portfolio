package fr.kolgna_sec.portfolio_api.account.keycloak;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Endpoint temporaire pour migrer les utilisateurs existants vers Keycloak
 * À SUPPRIMER après migration complète
 */
@RestController
@RequestMapping("admin/keycloak-migration")
@RequiredArgsConstructor
public class KeycloakMigrationController {

    private final AccountRepository accountRepository;
    private final KeycloakAdminService keycloakAdminService;

    /**
     * Migre UN utilisateur spécifique (par email) vers Keycloak
     *
     * POST /admin/keycloak-migration/migrate-user
     * Body: { "email": "support-admin@portfolio.fr", "password": "AdminPortfolio2025!" }
     */
    @PostMapping("migrate-user")
    public ResponseEntity<Map<String, Object>> migrateUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String newPassword = payload.get("password");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email requis"));
        }

        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Mot de passe requis"));
        }

        // 1. Vérifier que l'utilisateur existe en DB
        Account account = accountRepository.findByEmail(email)
                .orElse(null);

        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Utilisateur non trouvé en DB"));
        }

        // 2. Vérifier s'il existe déjà dans Keycloak
        String existingKeycloakId = keycloakAdminService.getUserIdByEmail(email);
        if (existingKeycloakId != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error", "L'utilisateur existe déjà dans Keycloak",
                            "keycloakUserId", existingKeycloakId
                    ));
        }

        // 3. Créer dans Keycloak
        String keycloakUserId = keycloakAdminService.createUser(
                account.getEmail(),
                account.getFirstName(),
                account.getName(),
                newPassword,
                true
        );

        if (keycloakUserId == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Échec de la création dans Keycloak"));
        }

        // 4. Déterminer si l'utilisateur doit avoir le rôle ADMIN
        // Note : Après refactoring, on peut utiliser un paramètre dans le payload
        // Pour l'instant, on assigne ADMIN par défaut pour le premier user migré
        boolean shouldBeAdmin = payload.getOrDefault("isAdmin", "true").equalsIgnoreCase("true");

        if (shouldBeAdmin) {
            boolean roleAssigned = keycloakAdminService.assignRealmRole(keycloakUserId, "ADMIN");
            if (!roleAssigned) {
                System.err.println("⚠️ Utilisateur créé mais rôle ADMIN non assigné");
            }
        }

        // 5. Mettre à jour l'ID Keycloak en DB
        account.setKeycloakUserId(keycloakUserId);
        accountRepository.save(account);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Utilisateur migré avec succès");
        response.put("email", email);
        response.put("keycloakUserId", keycloakUserId);
        response.put("roleAssigned", shouldBeAdmin ? "ADMIN" : "none");

        return ResponseEntity.ok(response);
    }

    /**
     * Migre TOUS les utilisateurs de la DB vers Keycloak
     * ATTENTION : nécessite de fournir un mot de passe par défaut
     *
     * POST /admin/keycloak-migration/migrate-all
     * Body: { "defaultPassword": "TempPassword2025!" }
     */
    @PostMapping("migrate-all")
    public ResponseEntity<Map<String, Object>> migrateAllUsers(@RequestBody Map<String, String> payload) {
        String defaultPassword = payload.get("defaultPassword");

        if (defaultPassword == null || defaultPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Mot de passe par défaut requis"));
        }

        List<Account> accounts = accountRepository.findAll();
        int migrated = 0;
        int skipped = 0;
        int errors = 0;

        for (Account account : accounts) {
            try {
                String existingKeycloakId = keycloakAdminService.getUserIdByEmail(account.getEmail());
                if (existingKeycloakId != null) {
                    skipped++;
                    continue;
                }

                String keycloakUserId = keycloakAdminService.createUser(
                        account.getEmail(),
                        account.getFirstName(),
                        account.getName(),
                        defaultPassword,
                        true
                );

                if (keycloakUserId != null) {
                    // On peut enrichir cette logique pour déterminer les rôles
                    // Pour l'instant, seul le premier admin sera migré avec le rôle

                    // Mettre à jour l'ID Keycloak en DB
                    account.setKeycloakUserId(keycloakUserId);
                    accountRepository.save(account);

                    migrated++;
                } else {
                    errors++;
                }
            } catch (Exception e) {
                System.err.println("Erreur migration " + account.getEmail() + ": " + e.getMessage());
                errors++;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("total", accounts.size());
        response.put("migrated", migrated);
        response.put("skipped", skipped);
        response.put("errors", errors);

        return ResponseEntity.ok(response);
    }

    /**
     * Teste la connexion Keycloak Admin API
     */
    @GetMapping("test-admin-connection")
    public ResponseEntity<Map<String, Object>> testAdminConnection() {
        String token = keycloakAdminService.getAdminAccessToken();

        if (token != null) {
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Connexion Admin Keycloak OK",
                    "tokenPreview", token.substring(0, Math.min(50, token.length())) + "..."
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", "error",
                            "message", "Échec de la connexion Admin Keycloak"
                    ));
        }
    }
}
