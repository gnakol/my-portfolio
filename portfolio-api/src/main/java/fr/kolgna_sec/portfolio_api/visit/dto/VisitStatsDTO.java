package fr.kolgna_sec.portfolio_api.visit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO pour les statistiques agrégées du cockpit admin
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VisitStatsDTO {
    private Long totalVisits;
    private Double averageSessionDuration; // en secondes
    private List<Map<String, Object>> visitsByCountry;
    private List<Map<String, Object>> visitsByPage;
    private List<Map<String, Object>> visitsByDevice;
    private List<Map<String, Object>> visitsByBrowser;
    private List<Map<String, Object>> topReferrers;
    private List<VisitDTO> recentVisits; // dernières 24h
}
