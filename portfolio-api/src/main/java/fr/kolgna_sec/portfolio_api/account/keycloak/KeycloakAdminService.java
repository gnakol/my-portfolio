package fr.kolgna_sec.portfolio_api.account.keycloak;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KeycloakAdminService {

    private final RestTemplate restTemplate;

    @Value("${keycloak.server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    /**
     * Récupère un token admin pour utiliser l'Admin REST API
     */
    public String getAdminAccessToken() {
        try {
            String url = keycloakServerUrl + "/realms/master/protocol/openid-connect/token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", "admin-cli");
            formData.add("username", adminUsername);
            formData.add("password", adminPassword);
            formData.add("grant_type", "password");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération du token admin: " + e.getMessage());
        }
        return null;
    }

    /**
     * Crée un utilisateur dans Keycloak
     *
     * @param email Email de l'utilisateur
     * @param firstName Prénom
     * @param lastName Nom
     * @param password Mot de passe (null si pas défini)
     * @param enabled Compte activé ou non
     * @return L'UUID Keycloak du user créé, ou null si erreur
     */
    public String createUser(String email, String firstName, String lastName, String password, boolean enabled) {
        String adminToken = getAdminAccessToken();
        if (adminToken == null) {
            System.err.println("Impossible de créer l'utilisateur: pas de token admin");
            return null;
        }

        try {
            String url = keycloakServerUrl + "/admin/realms/" + realm + "/users";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(adminToken);

            Map<String, Object> userRepresentation = new HashMap<>();
            userRepresentation.put("username", email);
            userRepresentation.put("email", email);
            userRepresentation.put("firstName", firstName);
            userRepresentation.put("lastName", lastName);
            userRepresentation.put("enabled", enabled);
            userRepresentation.put("emailVerified", true);

            // Si un mot de passe est fourni
            if (password != null && !password.isEmpty()) {
                Map<String, Object> credential = new HashMap<>();
                credential.put("type", "password");
                credential.put("value", password);
                credential.put("temporary", false); // false = pas besoin de reset au 1er login
                userRepresentation.put("credentials", List.of(credential));
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(userRepresentation, headers);

            ResponseEntity<Void> response = restTemplate.postForEntity(url, request, Void.class);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                // Récupère l'UUID du user créé depuis le header Location
                String location = response.getHeaders().getLocation().toString();
                String userId = location.substring(location.lastIndexOf('/') + 1);
                System.out.println("✅ Utilisateur créé dans Keycloak: " + email + " (ID: " + userId + ")");
                return userId;
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'utilisateur: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Assigne un rôle realm à un utilisateur
     *
     * @param userId UUID Keycloak de l'utilisateur
     * @param roleName Nom du rôle (ex: "ADMIN")
     * @return true si succès
     */
    public boolean assignRealmRole(String userId, String roleName) {
        String adminToken = getAdminAccessToken();
        if (adminToken == null) {
            return false;
        }

        try {
            // 1. Récupérer l'ID du rôle
            String getRoleUrl = keycloakServerUrl + "/admin/realms/" + realm + "/roles/" + roleName;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);

            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<Map> roleResponse = restTemplate.exchange(getRoleUrl, HttpMethod.GET, request, Map.class);

            if (roleResponse.getStatusCode() != HttpStatus.OK || roleResponse.getBody() == null) {
                System.err.println("Rôle non trouvé: " + roleName);
                return false;
            }

            Map<String, Object> roleRepresentation = roleResponse.getBody();

            // 2. Assigner le rôle au user
            String assignUrl = keycloakServerUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";

            HttpHeaders assignHeaders = new HttpHeaders();
            assignHeaders.setContentType(MediaType.APPLICATION_JSON);
            assignHeaders.setBearerAuth(adminToken);

            HttpEntity<List<Map<String, Object>>> assignRequest = new HttpEntity<>(List.of(roleRepresentation), assignHeaders);

            restTemplate.postForEntity(assignUrl, assignRequest, Void.class);

            System.out.println("✅ Rôle '" + roleName + "' assigné à l'utilisateur " + userId);
            return true;

        } catch (Exception e) {
            System.err.println("Erreur lors de l'assignation du rôle: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Vérifie si un utilisateur existe dans Keycloak (par email)
     *
     * @param email Email de l'utilisateur
     * @return L'UUID Keycloak si trouvé, null sinon
     */
    public String getUserIdByEmail(String email) {
        String adminToken = getAdminAccessToken();
        if (adminToken == null) {
            return null;
        }

        try {
            String url = keycloakServerUrl + "/admin/realms/" + realm + "/users?email=" + email;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);

            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, request, List.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null && !response.getBody().isEmpty()) {
                Map<String, Object> user = (Map<String, Object>) response.getBody().get(0);
                return (String) user.get("id");
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la recherche de l'utilisateur: " + e.getMessage());
        }
        return null;
    }
}
