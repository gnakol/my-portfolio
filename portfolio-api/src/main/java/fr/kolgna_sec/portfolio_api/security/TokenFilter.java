package fr.kolgna_sec.portfolio_api.security;

import fr.kolgna_sec.portfolio_api.account.service.AccountService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final AccountService accountService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Ex: /portfolio-api/actuator/health  -> path = /actuator/health
        final String path = request.getRequestURI().substring(request.getContextPath().length());

        // 1) Endpoints publics (whitelist)
        List<String> skipPaths = List.of(
                "/connexion", "/account/add-new-account", "/activation",
                "/reset-password", "/forgot-password", "/refresh-token",
                "/experience/all-experience", "/training/all-training",
                "/skill/all-skill", "/language/all-language", "/hobbies/all-hobbies",
                "/cv/download", "/contact/add-new-contact", "/skill-category/all-skill-category",
                "/project/all-project",
                // Actuator (avec ou sans context-path)
                "/actuator", "/actuator/health", "/actuator/prometheus"
        );

        List<String> skipPathsWithId = List.of(
                "/experience-type/get-by-id-experience-type/\\d+",
                "/establishment/get-by-id-establishment/\\d+",
                "/skill-category/get-by-id-skill-category/\\d+",
                "/skill/by-category/\\d+",
                "/project-type/get-project-type-by-id/\\d+",
                "/project/get-project-by-id/\\d+",
                "/account/get-cv-url/\\d+"
        );

        if (path.startsWith("/actuator") || path.contains("/actuator/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Si l’URL est publique -> on laisse passer immédiatement
        if (skipPaths.stream().anyMatch(path::startsWith)
                || path.contains("/refresh-token")
                || path.startsWith("/actuator")
                || skipPathsWithId.stream().anyMatch(path::matches)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2) Gestion du header Authorization
        final String authorization = request.getHeader("Authorization");

        // ➜ IMPORTANT: s'il n'y a PAS de token, on NE bloque pas (pas de 401)
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3) Ici on a un token -> on le valide
        final String token = authorization.substring(7);
        final boolean isTokenExpired = tokenService.isTokenExpired(token);
        final boolean isTokenDisabled = tokenService.isTokenDisabled(token);
        final String username = tokenService.extractUsername(token);

        if (!isTokenExpired && !isTokenDisabled && username != null
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = accountService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // continue
            filterChain.doFilter(request, response);
            return;
        }

        // 4) Cas d’erreur de token (uniquement si un token était présent)
        if (isTokenExpired) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token has expired");
            return;
        }

        if (isTokenDisabled) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token is disable or invalid");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
