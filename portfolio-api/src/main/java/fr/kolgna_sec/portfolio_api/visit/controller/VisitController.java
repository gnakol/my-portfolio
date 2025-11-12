package fr.kolgna_sec.portfolio_api.visit.controller;

import fr.kolgna_sec.portfolio_api.visit.dto.CreateVisitRequest;
import fr.kolgna_sec.portfolio_api.visit.dto.VisitDTO;
import fr.kolgna_sec.portfolio_api.visit.dto.VisitStatsDTO;
import fr.kolgna_sec.portfolio_api.visit.service.VisitService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("visits")
@Slf4j
@CrossOrigin(origins = {"http://localhost:4200", "https://kolie-portfolio.org", "https://v2.kolie-portfolio.org"})
public class VisitController {

    private final VisitService visitService;

    /**
     * Enregistre une nouvelle visite (PUBLIC - appelé par tous les visiteurs)
     *
     * POST /visits
     * @param request CreateVisitRequest (pageUrl, referrer, sessionDuration optionnel)
     * @param httpRequest HttpServletRequest pour extraire IP + User-Agent
     * @return VisitDTO créé
     */
    @PostMapping
    public ResponseEntity<VisitDTO> createVisit(
            @RequestBody CreateVisitRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("📊 POST /visits - pageUrl={}, referrer={}", request.getPageUrl(), request.getReferrer());

        try {
            VisitDTO visit = visitService.createVisit(request, httpRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(visit);
        } catch (Exception e) {
            log.error("❌ Erreur création visite", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Met à jour la durée de session (heartbeat depuis le frontend)
     *
     * PUT /visits/{id}/duration
     * @param visitId ID de la visite
     * @param sessionDuration Durée en secondes
     * @return VisitDTO mis à jour
     */
    @PutMapping("/{id}/duration")
    public ResponseEntity<VisitDTO> updateSessionDuration(
            @PathVariable("id") Long visitId,
            @RequestParam("sessionDuration") Integer sessionDuration
    ) {
        log.info("⏱️ PUT /visits/{}/duration - duration={}s", visitId, sessionDuration);

        try {
            VisitDTO visit = visitService.updateSessionDuration(visitId, sessionDuration);
            return ResponseEntity.ok(visit);
        } catch (RuntimeException e) {
            log.error("❌ Erreur update session duration: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("❌ Erreur update session duration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère les statistiques globales (ADMIN - pour le cockpit)
     *
     * GET /visits/stats
     * @return VisitStatsDTO avec toutes les analytics
     */
    @GetMapping("/stats")
    public ResponseEntity<VisitStatsDTO> getStats() {
        log.info("📈 GET /visits/stats");

        try {
            VisitStatsDTO stats = visitService.getStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("❌ Erreur récupération stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère toutes les visites (ADMIN - pour export ou filtrage avancé)
     *
     * GET /visits
     * @return Liste de VisitDTO
     */
    @GetMapping
    public ResponseEntity<List<VisitDTO>> getAllVisits() {
        log.info("📋 GET /visits");

        try {
            List<VisitDTO> visits = visitService.getAllVisits();
            return ResponseEntity.ok(visits);
        } catch (Exception e) {
            log.error("❌ Erreur récupération visites", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
