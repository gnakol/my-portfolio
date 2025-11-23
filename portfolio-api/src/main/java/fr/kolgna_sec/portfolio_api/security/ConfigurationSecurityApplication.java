package fr.kolgna_sec.portfolio_api.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class ConfigurationSecurityApplication {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Routes publiques
                        .requestMatchers("/actuator/**", "/portfolio-api/actuator/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/account/add-new-account").permitAll()
                        .requestMatchers(HttpMethod.GET, "/account/get-cv-url/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/activation").permitAll()
                        .requestMatchers(HttpMethod.POST, "/connexion").permitAll()
                        .requestMatchers(HttpMethod.POST, "/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/reset-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/refresh-token").permitAll()
                        .requestMatchers(HttpMethod.POST, "/contact/add-new-contact").permitAll()
                        .requestMatchers(HttpMethod.GET, "/experience/all-experience").permitAll()
                        .requestMatchers(HttpMethod.GET, "/project/all-project").permitAll()
                        .requestMatchers(HttpMethod.GET, "/project/get-project-by-id/{idProject}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/project-type/get-project-type-by-id/{idProjectType}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/experience-type/get-by-id-experience-type/{idExperienceType}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/skill/all-skill").permitAll()
                        .requestMatchers(HttpMethod.GET, "/hobbies/all-hobbies").permitAll()
                        .requestMatchers(HttpMethod.GET, "/skill-category/get-by-id-skill-category/{idSkillCategory}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/skill/by-category/{categoryId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/skill/by-category/\\d+").permitAll()
                        .requestMatchers(HttpMethod.GET, "/skill-category/all-skill-category").permitAll()
                        .requestMatchers(HttpMethod.GET, "/training/all-training").permitAll()
                        .requestMatchers(HttpMethod.GET, "/establishment/get-by-id-establishment/{idEstablishment}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/language/all-language").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cv/download").permitAll()
                        .requestMatchers("/ws-mission-control/**").permitAll()
                        .requestMatchers("/simulation/session/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/simulation/ping").permitAll()
                        .requestMatchers(HttpMethod.POST, "/simulation/vlan").permitAll()
                        .requestMatchers(HttpMethod.POST, "/simulation/eigrp").permitAll()
                        .requestMatchers(HttpMethod.POST, "/feedback/add-feedback").permitAll()
                        .requestMatchers(HttpMethod.POST, "/simulation/session/start").permitAll()
                        // Firewall Attack Blocker Simulation
                        .requestMatchers(HttpMethod.POST, "/api/simulation/firewall/start").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/simulation/firewall/execute-rule").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/simulation/firewall/end").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/simulation/firewall/leaderboard").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/simulation/firewall/health").permitAll()
                        .requestMatchers(HttpMethod.GET, "/media/public").permitAll()
                        .requestMatchers(HttpMethod.POST, "/visits").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/visits/*/duration").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Endpoints de migration Keycloak (TEMPORAIRE - à supprimer après migration)
                        .requestMatchers("/admin/keycloak-migration/**").permitAll()

                        // Routes nécessitant une authentification
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
                        })
                )
                .build();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        Converter<Jwt, Collection<GrantedAuthority>> converter = jwt -> {
            // Extrait les rôles depuis realm_access.roles (rôles globaux Keycloak)
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            List<String> roles = Collections.emptyList();
            if (realmAccess != null && realmAccess.get("roles") instanceof List) {
                roles = (List<String>) realmAccess.get("roles");
            }

            // Extrait les rôles depuis resource_access.<client_name>.roles (rôles spécifiques au client)
            Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
            if (resourceAccess != null) {
                // Remplace "portfolio-app" par le nom de ton client dans Keycloak
                Map<String, Object> clientAccess = (Map<String, Object>) resourceAccess.get("portfolio-app");
                if (clientAccess != null && clientAccess.get("roles") instanceof List) {
                    roles.addAll((List<String>) clientAccess.get("roles"));
                }
            }

            // Convertit chaque rôle en une autorité Spring Security avec le préfixe ROLE_
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                    .collect(Collectors.toList());
        };

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(converter);
        return jwtAuthenticationConverter;
    }
}