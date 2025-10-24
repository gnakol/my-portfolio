package fr.kolgna_sec.portfolio_api.token.controller;

import fr.kolgna_sec.portfolio_api.security.TokenService;
import fr.kolgna_sec.portfolio_api.token.dto.TokenDTO;
import fr.kolgna_sec.portfolio_api.token.service.TokenBeanService;
import fr.kolgna_sec.portfolio_api.token.service.TokenCleanupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("token")
public class TokenController {

    private final TokenBeanService tokenBeanService;

    private final TokenService tokenService;
    private final TokenCleanupService tokenCleanupService;

    @GetMapping("all-token")
    public ResponseEntity<Page<TokenDTO>> allToken(Pageable pageable)
    {
        return ResponseEntity.ok(this.tokenBeanService.allToken(pageable));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("remove-all-token")
    public ResponseEntity<String> removeAllToken()
    {
        //this.beanTokenService.removeToken();

        return ResponseEntity.ok("Remove all token was successfully");
    }

    @PostMapping("validate-token")
    public ResponseEntity<Map<String, Boolean>> validateToken(@RequestBody Map<String, String> request) {

        String token = request.get("token");

        boolean isValid = tokenService.validateToken(token);

        return ResponseEntity.ok(Map.of("isValid", isValid));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("remove-token-by-id/{idToken}")
    public ResponseEntity<String> removeTokenById(@Validated @PathVariable Long idToken)
    {
        this.tokenBeanService.removeTokenById(idToken);

        return ResponseEntity.ok("Token was successfully remove");
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("remove-token-by-range/{idToken}")
    public ResponseEntity<String> removeTokenByRange(@Validated @PathVariable Long startId, @PathVariable Long endId)
    {
        this.tokenBeanService.removeTokenByRange(startId, endId);

        return ResponseEntity.ok("Token was successfully remove by range");
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("remove-token-by-choose-id")
    public ResponseEntity<String> removeTokenById(@Validated @RequestBody List<Long> ids)
    {
        this.tokenBeanService.removeTokenByCheckId(ids);

        return ResponseEntity.ok("Token was successfully remove by check id");
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("cleanup-tokens")
    public ResponseEntity<Map<String, Object>> cleanupTokens() {
        log.info("Nettoyage manuel des tokens demandé...");

        Map<String, Long> statsBefore = tokenCleanupService.getTokenStats();
        int deletedCount = tokenCleanupService.cleanupExpiredAndDisabledTokens();
        Map<String, Long> statsAfter = tokenCleanupService.getTokenStats();

        Map<String, Object> response = Map.of(
                "message", "Nettoyage des tokens terminé avec succès",
                "tokensDeleted", deletedCount,
                "statsBefore", statsBefore,
                "statsAfter", statsAfter
        );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("token-stats")
    public ResponseEntity<Map<String, Long>> getTokenStats() {
        return ResponseEntity.ok(tokenCleanupService.getTokenStats());
    }

}
