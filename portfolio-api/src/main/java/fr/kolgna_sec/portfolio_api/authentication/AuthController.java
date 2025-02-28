package fr.kolgna_sec.portfolio_api.authentication;

import fr.kolgna_sec.portfolio_api.account.service.AccountService;
import fr.kolgna_sec.portfolio_api.security.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final TokenService tokenService;

    private final AccountService accountService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping(path = "connexion", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> connexion(@Validated @RequestBody Authentication beansRecord) {
        final org.springframework.security.core.Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(beansRecord.username(), beansRecord.password())
        );

        if(authenticate.isAuthenticated()) {
            return this.tokenService.generate(beansRecord.username());
        }
        return null;
    }

    @PostMapping("disconnect")
    public ResponseEntity<Map<String, String>> disconnect(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            this.tokenService.invalidateToken(token);
            Map<String, String> response = Map.of("message", "disconnection successful");
            return ResponseEntity.ok(response);
        }

        Map<String, String> response = Map.of("error", "Aucun token fourni");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping(path = "refresh-token", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> refreshToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            System.out.println("Refreshing token for request: " + token);

            return tokenService.refreshToken(token);
        }

        throw new RuntimeException("No valid token provided for refresh");
    }

}
