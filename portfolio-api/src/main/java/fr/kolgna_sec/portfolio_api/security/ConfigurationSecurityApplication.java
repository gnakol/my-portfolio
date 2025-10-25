package fr.kolgna_sec.portfolio_api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.http.HttpMethod.POST;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
@RequiredArgsConstructor
public class ConfigurationSecurityApplication {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final TokenFilter tokenFilter;

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable) // ❌ Désactive CSRF (ce qui est correct ici)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/**", "/portfolio-api/actuator/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/account/add-new-account").permitAll()
                        .requestMatchers(HttpMethod.GET, "/account/get-cv-url/{id}").permitAll()
                        //.requestMatchers(HttpMethod.DELETE, "/account/remove-account/{idAccount}").permitAll()
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
                        .anyRequest().authenticated())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)) // Configure l'entry point d'authentification
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Gestion des sessions sans état
                .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class) // Ajoute le filtre JWT avant le filtre par défaut
                .build();
    }



    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService)
    {
        DaoAuthenticationProvider daoAuthenticationProvider = new  DaoAuthenticationProvider();

        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(this.bCryptPasswordEncoder);

        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManagerBean(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.getSharedObject(AuthenticationManagerBuilder.class).build();
    }
}
