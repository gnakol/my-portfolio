package fr.kolgna_sec.portfolio_api.authentication;

import fr.kolgna_sec.portfolio_api.account.dto.LoginRequestDTO;
import fr.kolgna_sec.portfolio_api.account.keycloak.KeycloakAccountService;
import fr.kolgna_sec.portfolio_api.account.keycloak.KeycloakTokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controller d'authentification - Migration Keycloak
 */
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakAccountService keycloakAccountService;
    private final KeycloakTokenService keycloakTokenService;

    @PostMapping(path = "connexion", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> connexion(@RequestBody LoginRequestDTO loginRequestDTO) {
        Map<String, String> tokens = this.keycloakAccountService.authenticateUser(loginRequestDTO);

        if (tokens == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Identifiants invalides"));
        }

        String accessToken = tokens.get("access_token");

        if (!this.keycloakAccountService.hasRealmRole(accessToken, "ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Accès réservé à l'administrateur"));
        }

        return ResponseEntity.ok(tokens);
    }
    /**
     * Déconnexion (révocation du refresh token)
     *
     * Body: { "refresh_token": "..." }
     */
    @PostMapping("disconnect")
    public ResponseEntity<Map<String, String>> disconnect(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refresh_token");

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Refresh token requis"));
        }

        boolean revoked = this.keycloakTokenService.revokeToken(refreshToken);

        if (revoked) {
            return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Échec de la révocation du token"));
        }
    }

    /**
     * Refresh d'un access token
     *
     * Body: { "refresh_token": "..." }
     */
    @PostMapping(path = "refresh-token", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refresh_token");

        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Refresh token requis"));
        }

        Map<String, String> newTokens = this.keycloakTokenService.refreshToken(refreshToken);

        if (newTokens != null) {
            return ResponseEntity.ok(newTokens);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token invalide ou expiré"));
        }
    }
}
