package fr.kolgna_sec.portfolio_api.account.keycloak;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Service de gestion des tokens Keycloak
 *
 * Responsabilité :
 * - Refresh des access tokens via refresh token
 * - Révocation de tokens (logout)
 */
@Service
@RequiredArgsConstructor
public class KeycloakTokenService {

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
     * Refresh un access token Keycloak via le refresh token
     *
     * @param refreshToken Le refresh token reçu lors de la connexion
     * @return Map contenant le nouveau access_token et refresh_token
     */
    public Map<String, String> refreshToken(String refreshToken) {
        try {
            String url = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("grant_type", "refresh_token");
            formData.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                return Map.of(
                        "access_token", (String) responseBody.get("access_token"),
                        "refresh_token", (String) responseBody.get("refresh_token"),
                        "expires_in", String.valueOf(responseBody.get("expires_in"))
                );
            }
        } catch (Exception e) {
            System.err.println("Erreur lors du refresh du token: " + e.getMessage());
        }
        return null;
    }

    /**
     * Révoque un refresh token (logout)
     *
     * @param refreshToken Le refresh token à révoquer
     * @return true si succès
     */
    public boolean revokeToken(String refreshToken) {
        try {
            String url = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Void> response = restTemplate.postForEntity(url, request, Void.class);

            return response.getStatusCode() == HttpStatus.NO_CONTENT;
        } catch (Exception e) {
            System.err.println("Erreur lors de la révocation du token: " + e.getMessage());
        }
        return false;
    }
}
