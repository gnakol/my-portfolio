package fr.kolgna_sec.portfolio_api.monitoring.security_status.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour les informations de planification crontab
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrontabInfoDTO {

    private String cronExpression;      // ex: "15 3 * * *"
    private String description;         // ex: "Tous les jours à 3h15"
    private String command;             // ex: "/home/ubuntu/portfolio/renew-cert.sh"
    private String logFile;             // ex: "/var/log/certbot-renew.log"
    private String nextExecution;       // Prochaine exécution estimée
    private Boolean isActive;           // Si la tâche est active
    private String environment;         // "local" ou "production"
}
