package fr.kolgna_sec.portfolio_api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    public CorsConfig()
    {
        System.out.println("🚀 CorsConfig: Le bean est en cours de création !");
        logger.info("🚀 CorsConfig: Le bean est en cours de création !");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        logger.info("🚀 CorsConfig est en train de s'initialiser !");
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                logger.info("Configuration CORS ajoutée");
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200") // Spécifie ici l'URL de ton application front-end
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
