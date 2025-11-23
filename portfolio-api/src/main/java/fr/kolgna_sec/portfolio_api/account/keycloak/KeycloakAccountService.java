package fr.kolgna_sec.portfolio_api.account.keycloak;

import fr.kolgna_sec.portfolio_api.account.dto.LoginRequestDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KeycloakAccountService {

    private final RestTemplate restTemplate;

    @Value("${keycloak.server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    /**
     * Authentifie un utilisateur et retourne les tokens Keycloak
     *
     * @param loginRequestDTO Identifiants (email + password)
     * @return Map contenant access_token, refresh_token, expires_in
     */
    public Map<String, String> authenticateUser(LoginRequestDTO loginRequestDTO) {
        try {
            String url = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            formData.add("username", loginRequestDTO.getEmail());
            formData.add("password", loginRequestDTO.getPassword());
            formData.add("grant_type", "password");

            if (clientSecret != null && !clientSecret.isEmpty()) {
                formData.add("client_secret", clientSecret);
            }

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    url,
                    request,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                return Map.of(
                        "access_token", (String) responseBody.get("access_token"),
                        "refresh_token", (String) responseBody.get("refresh_token"),
                        "expires_in", String.valueOf(responseBody.get("expires_in"))
                );
            }
        } catch (Exception e) {
            System.err.println("Erreur d'authentification Keycloak: " + e.getMessage());
        }
        return null;
    }

    public boolean hasRealmRole(String jwtToken, String expectedRole) {
        try {
            // Parse le JWT sans vérifier la signature (pour extraction des claims seulement)
            String[] parts = jwtToken.split("\\.");
            if (parts.length < 2) {
                return false;
            }

            String unsignedToken = parts[0] + "." + parts[1] + ".";

            Claims claims = Jwts.parserBuilder()
                    .build()
                    .parseClaimsJwt(unsignedToken)
                    .getBody();

            Map<String, Object> realmAccess = (Map<String, Object>) claims.get("realm_access");
            if (realmAccess != null) {
                List<String> roles = (List<String>) realmAccess.get("roles");
                return roles != null && roles.contains(expectedRole);
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'extraction des rôles: " + e.getMessage());
        }
        return false;
    }
}