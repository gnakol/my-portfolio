package fr.kolgna_sec.portfolio_api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * @deprecated Ce filtre est obsolète. L'authentification JWT est maintenant gérée par Spring Security OAuth2 Resource Server (voir ConfigurationSecurityApplication.java)
 */
@Deprecated
@Service
@RequiredArgsConstructor
public class TokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // Ce filtre est obsolète. La validation JWT est maintenant gérée par Spring Security OAuth2 Resource Server
        // Voir ConfigurationSecurityApplication.java pour la configuration
        filterChain.doFilter(request, response);
    }
}
