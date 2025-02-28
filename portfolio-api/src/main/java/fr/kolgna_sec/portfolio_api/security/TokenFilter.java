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
        List<String> skipPaths = List.of("/connexion", "/account/add-new-account", "/activation", "/reset-password", "/forgot-password", "/refresh-token",
                "/experience/all-experience", "/establishment/all-establishment", "/training/all-training", "/experience/all-experience-type", "/skill/all-skill",
                "/skill/all-skill-category", "/language/all-language", "/hobbies/all-hobbies", "/account/remove-account/{idAccount}");

        if (skipPaths.stream().anyMatch(path::startsWith) || path.contains("/refresh-token")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;

        String username = null;

        boolean isTokenExpired = true;

        boolean isTokenDisabled = true;

        // Bearer eyJhbGciOiJIUzI1NiJ9.eyJub20iOiJBY2hpbGxlIE1CT1VHVUVORyIsImVtYWlsIjoiYWNoaWxsZS5tYm91Z3VlbmdAY2hpbGxvLnRlY2gifQ.zDuRKmkonHdUez-CLWKIk5Jdq9vFSUgxtgdU1H2216U
        final String authorization = request.getHeader("Authorization");

        System.out.println("token complet : " +authorization);
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
