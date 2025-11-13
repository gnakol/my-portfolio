package fr.kolgna_sec.portfolio_api.visit.controller;

import fr.kolgna_sec.portfolio_api.visit.dto.CreateVisitRequest;
import fr.kolgna_sec.portfolio_api.visit.dto.DeleteVisitsBatchRequest;
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
import java.util.Map;

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

    // ========== NOUVEAUX ENDPOINTS DE GESTION ==========

    /**
     * Supprime une visite par son ID (ADMIN)
     *
     * DELETE /visits/{id}
     * @param visitId ID de la visite à supprimer
     * @return 204 No Content si succès
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable("id") Long visitId) {
        log.info("🗑️ DELETE /visits/{}", visitId);

        try {
            visitService.deleteVisit(visitId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("❌ Visite introuvable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("❌ Erreur suppression visite", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprime plusieurs visites en batch (ADMIN)
     *
     * DELETE /visits/batch
     * @param request DeleteVisitsBatchRequest contenant la liste des IDs
     * @return 204 No Content si succès
     */
    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteVisitsInBatch(@RequestBody DeleteVisitsBatchRequest request) {
        log.info("🗑️ DELETE /visits/batch - {} visites", request.getIds() != null ? request.getIds().size() : 0);

        try {
            visitService.deleteVisitsInBatch(request.getIds());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("❌ Erreur suppression batch", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprime toutes les visites antérieures à X jours (ADMIN - purge)
     *
     * DELETE /visits/older-than/{days}
     * @param days Nombre de jours (ex: 30 pour supprimer tout ce qui a > 30 jours)
     * @return Nombre de visites supprimées
     */
    @DeleteMapping("/older-than/{days}")
    public ResponseEntity<Map<String, Object>> deleteVisitsOlderThan(@PathVariable("days") int days) {
        log.info("🗑️ DELETE /visits/older-than/{}", days);

        try {
            int deletedCount = visitService.deleteVisitsOlderThan(days);
            return ResponseEntity.ok(Map.of(
                    "deletedCount", deletedCount,
                    "message", deletedCount + " visite(s) supprimée(s)"
            ));
        } catch (IllegalArgumentException e) {
            log.error("❌ Paramètre invalide: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("❌ Erreur purge visites", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère l'évolution temporelle des visites (ADMIN - analytics)
     *
     * GET /visits/stats/timeline
     * @return Liste de {date, count}
     */
    @GetMapping("/stats/timeline")
    public ResponseEntity<List<Map<String, Object>>> getVisitsTimeline() {
        log.info("📈 GET /visits/stats/timeline");

        try {
            List<Map<String, Object>> timeline = visitService.getVisitsTimeline();
            return ResponseEntity.ok(timeline);
        } catch (Exception e) {
            log.error("❌ Erreur récupération timeline", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
