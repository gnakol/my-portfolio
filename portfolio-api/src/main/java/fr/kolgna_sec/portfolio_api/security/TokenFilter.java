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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI().substring(request.getContextPath().length());

        // Liste des endpoints qui ne nécessitent pas de vérification de token
        List<String> skipPaths = List.of(
                "/connexion", "/account/add-new-account", "/activation", "/reset-password", "/forgot-password", "/refresh-token",
                "/experience/all-experience", "/training/all-training",
                "/skill/all-skill", "/language/all-language", "/hobbies/all-hobbies",
                "/cv/download", "/contact/add-new-contact", "/skill-category/all-skill-category"
        );

// Liste des chemins avec un paramètre dynamique {id}
        List<String> skipPathsWithId = List.of(
                "/experience-type/get-by-id-experience-type/\\d+",
                "/establishment/get-by-id-establishment/\\d+",
                "/skill-category/get-by-id-skill-category/\\d+",
                "/skill/by-category/\\d+"
        );

// Vérification des chemins sans paramètres dynamiques
        if (skipPaths.stream().anyMatch(path::startsWith) || path.contains("/refresh-token") ||
                skipPathsWithId.stream().anyMatch(path::matches)) {
            filterChain.doFilter(request, response);
            return;
        }



/*// ❌ On ne vérifie le token QUE pour les routes protégées
        if (path.matches("/account/update-account/\\d+") || path.matches("/account/remove-account/\\d+") ||
                path.startsWith("/experience/add-experience") || path.matches("/experience/update-experience/\\d+") || path.matches("/experience/remove-experience/\\d+") ||
                path.startsWith("/skill/add-skill") || path.matches("/skill/update-skill/\\d+") || path.matches("/skill/remove-skill/\\d+") ||
                path.startsWith("/skill-category/add-skill-category") || path.matches("/skill-category/update-skill-category/\\d+") || path.matches("/skill-category/remove-skill-category/\\d+") ||
                path.startsWith("/experience-type/add-experience-type") || path.matches("/experience-type/update-experience-type/\\d+") || path.matches("/experience-type/remove-experience-type/\\d+") ||
                path.startsWith("/training/add-training") || path.matches("/training/update-training/\\d+") || path.matches("/training/remove-training/\\d+") ||
                path.startsWith("/establishment/add-establishment") || path.matches("/establishment/update-establishment/\\d+") || path.matches("/establishment/remove-establishment/\\d+") ||
                path.startsWith("/hobbies/add-hobbies") || path.matches("/hobbies/update-hobbies/\\d+") || path.matches("/hobbies/remove-hobbies/\\d+") ||
                path.startsWith("/language/add-language") || path.matches("/language/update-language/\\d+") || path.matches("/language/remove-language/\\d+") ||
                path.startsWith("/log-security/all-log-security") )
                 {

            // 🔥 Vérification du token uniquement pour les routes sensibles
        } else {
            // ✅ Si la route est publique, on laisse passer sans token
            filterChain.doFilter(request, response);
            return;
        }*/


        String token = null;

        String username = null;

        boolean isTokenExpired = true;

        boolean isTokenDisabled = true;

        // Bearer eyJhbGciOiJIUzI1NiJ9.eyJub20iOiJBY2hpbGxlIE1CT1VHVUVORyIsImVtYWlsIjoiYWNoaWxsZS5tYm91Z3VlbmdAY2hpbGxvLnRlY2gifQ.zDuRKmkonHdUez-CLWKIk5Jdq9vFSUgxtgdU1H2216U
        final String authorization = request.getHeader("Authorization");

        //System.out.println("token complet : " +authorization);
        if(authorization != null && authorization.startsWith("Bearer ")){

            token = authorization.substring(7);

            isTokenExpired = tokenService.isTokenExpired(token);

            isTokenDisabled = tokenService.isTokenDisabled(token);

            username = tokenService.extractUsername(token);
        }

        if(!isTokenExpired && !isTokenDisabled && username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = accountService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        } else
        {
            if (isTokenExpired) { // Permet d'accéder à refresh-token même avec un token expiré
                System.out.println("Sending 401 Unauthorized due to expired token.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token has expired");
                return;
            }

            if (isTokenDisabled) {
                System.out.println("Sending 401 Unauthorized due to disabled token.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token is disable or invalid");
                return;
            }

        }

        filterChain.doFilter(request, response);

    }
}
