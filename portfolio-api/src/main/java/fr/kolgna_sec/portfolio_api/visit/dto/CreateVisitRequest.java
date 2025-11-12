package fr.kolgna_sec.portfolio_api.visit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour la création d'une visite depuis le frontend
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateVisitRequest {
    private String pageUrl;
    private String referrer;
    private Integer sessionDuration; // optionnel, mis à jour via heartbeat
}
