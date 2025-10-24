package fr.kolgna_sec.portfolio_api.token.service;

import fr.kolgna_sec.portfolio_api.security.TokenService;
import fr.kolgna_sec.portfolio_api.token.bean.Token;
import fr.kolgna_sec.portfolio_api.token.repositories.TokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupService {

    private final TokenRepository tokenRepository;
    private final TokenService tokenService;

    /**
     * Nettoie tous les tokens expirés ou désactivés
     */
    @Transactional
    public int cleanupExpiredAndDisabledTokens() {
        log.info("Début du nettoyage automatique des tokens...");

        // D'abord, on met à jour le statut d'expiration des tokens
        updateTokensExpirationStatus();

        // Ensuite, on supprime les tokens expirés ou désactivés
        int deletedCount = tokenRepository.deleteExpiredOrDisabledTokens();

        log.info("Nettoyage terminé : {} tokens expirés ou désactivés ont été supprimés", deletedCount);
        return deletedCount;
    }

    /**
     * Met à jour le statut d'expiration des tokens en vérifiant leur validité
     */
    private void updateTokensExpirationStatus() {
        List<Token> allTokens = tokenRepository.findAll();
        int updatedCount = 0;

        for (Token token : allTokens) {
            try {
                // Vérifie si le token est expiré via JWT
                boolean isExpired = tokenService.isTokenExpired(token.getValueToken());

                // Si le statut a changé, on met à jour
                if (isExpired != token.getExpirationToken()) {
                    token.setExpirationToken(isExpired);
                    tokenRepository.save(token);
                    updatedCount++;
                }
            } catch (Exception e) {
                // Si la validation échoue, on marque le token comme expiré
                log.warn("Token invalide détecté (ID: {}), marquage comme expiré", token.getIdToken());
                token.setExpirationToken(true);
                tokenRepository.save(token);
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            log.info("Statut d'expiration mis à jour pour {} tokens", updatedCount);
        }
    }

    /**
     * Nettoie uniquement les tokens expirés
     */
    @Transactional
    public int cleanupExpiredTokens() {
        log.info("Nettoyage des tokens expirés...");
        updateTokensExpirationStatus();
        int deletedCount = tokenRepository.deleteExpiredTokens();
        log.info("{} tokens expirés supprimés", deletedCount);
        return deletedCount;
    }

    /**
     * Nettoie uniquement les tokens désactivés
     */
    @Transactional
    public int cleanupDisabledTokens() {
        log.info("Nettoyage des tokens désactivés...");
        int deletedCount = tokenRepository.deleteDisabledTokens();
        log.info("{} tokens désactivés supprimés", deletedCount);
        return deletedCount;
    }

    /**
     * Récupère les statistiques des tokens
     */
    public Map<String, Long> getTokenStats() {
        long totalTokens = tokenRepository.count();
        long expiredTokens = tokenRepository.findExpiredTokens().size();
        long disabledTokens = tokenRepository.findDisabledTokens().size();
        long activeTokens = totalTokens - expiredTokens - disabledTokens;

        return Map.of(
                "total", totalTokens,
                "expired", expiredTokens,
                "disabled", disabledTokens,
                "active", activeTokens
        );
    }
}
