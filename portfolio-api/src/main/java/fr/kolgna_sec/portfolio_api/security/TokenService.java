package fr.kolgna_sec.portfolio_api.security;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.service.AccountService;
import fr.kolgna_sec.portfolio_api.token.bean.Token;
import fr.kolgna_sec.portfolio_api.token.repositories.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
@AllArgsConstructor
public class TokenService {

    private final String ENCRYPTION_KEY = "0e851c457664290a9b90e1f85bddad9128a196846e2d43df03728a95d24055bc";

    private AccountService accountService;

    private TokenRepository tokenRepository;

    public Map<String, String> generate(String username) {
        Account account = (Account) this.accountService.loadUserByUsername(username);
        return this.generateJwt(account);
    }

    private Map<String, String> generateJwt(Account account) {
        final long currentTime = System.currentTimeMillis();
        final long expirationTime = currentTime + 60 * 60 * 1000;

        System.out.println("*******************Generating token for account: " + account.getEmail());
        System.out.println("*******************Token expiration time: " + new Date(expirationTime));

        final Map<String, Object> claims = Map.of(
                "name", account.getName(),
                "roles", account.getRoles(),
                Claims.EXPIRATION, new Date(expirationTime),
                Claims.SUBJECT, account.getEmail()
        );

        final String bearer = Jwts.builder()
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(expirationTime))
                .setSubject(account.getEmail())
                .setClaims(claims)
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();

        Token tokenBean = Token.builder()
                .valueToken(bearer)
                .statusToken(false)
                .expirationToken(false)
                .account(account)
                .build();
        System.out.println("Saving new token: " + bearer);
        this.tokenRepository.save(tokenBean);
        return Map.of("bearer", bearer);
    }

    private <T> T getClaim(String token, Function<Claims, T> function) {
        Claims claims = getAllClaims(token);
        return function.apply(claims);
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.getKey())
                .setAllowedClockSkewSeconds(60)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getKey() {
        final byte[] decoder = Decoders.BASE64.decode(ENCRYPTION_KEY);
        return Keys.hmacShaKeyFor(decoder);
    }

    public String extractUsername(String token) {
        return this.getClaim(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token) {
        Date expirationDate = getExpirationDateFromToken(token);
        return expirationDate.before(new Date());
    }

    private Date getExpirationDateFromToken(String token) {
        return this.getClaim(token, Claims::getExpiration);
    }

    public void invalidateToken(String token)
    {
        String username = this.extractUsername(token);

        Token tokenBean = this.tokenRepository.findByValueToken(token).get();

        if (!tokenBean.getExpirationToken())
        {
            tokenBean.setStatusToken(true);
            this.tokenRepository.save(tokenBean);
        }
    }

    public boolean isTokenDisabled(String token)
    {
        Token tokenBean = this.tokenRepository.findByValueToken(token).get();

        return tokenBean.getStatusToken();
    }


    public boolean validateToken(String token) {
        try {
            if (isTokenExpired(token)) {
                System.out.println("Token is expired.");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token has expired");
            }

            if (isTokenDisabled(token)) {
                System.out.println("Token is disabled.");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token is disabled");
            }

            System.out.println("Token is valid.");
            return true;
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }





    public Map<String, String> refreshToken(String token) {
        try {
            // Essayer d'extraire l'utilisateur même si le token est expiré
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(this.getKey())
                    .setAllowedClockSkewSeconds(60) // Tolérer une petite dérive
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            Account account = (Account) accountService.loadUserByUsername(username);

            // Générer un nouveau token
            return generateJwt(account);
        } catch (ExpiredJwtException e) {
            // Si le token est expiré, on ne déclenche pas d'exception supplémentaire
            throw new RuntimeException("Token expired, cannot refresh");
        } catch (Exception e) {
            throw new RuntimeException("Token invalid or expired, cannot refresh", e);
        }
    }



}
