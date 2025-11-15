package fr.kolgna_sec.portfolio_api.monitoring.security_status.service;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.dto.CrontabInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Service pour lire les informations de planification crontab
 */
@Service
@Slf4j
public class CrontabService {

    @Value("${spring.config.activate.on-profile:default}")
    private String activeProfile;

    /**
     * Récupère les informations de planification du renouvellement de certificat
     */
    public CrontabInfoDTO getCertRenewalCronInfo() {
        log.info("📅 Récupération des informations crontab pour le renouvellement de certificat");

        // En local, retourner une config fictive
        if ("default".equals(activeProfile)) {
            return CrontabInfoDTO.builder()
                    .cronExpression("15 3 * * *")
                    .description("Tous les jours à 3h15 du matin")
                    .command("/home/ubuntu/portfolio/renew-cert.sh")
                    .logFile("/var/log/certbot-renew.log")
                    .nextExecution(calculateNextExecution("15 3 * * *"))
                    .isActive(false)
                    .environment("local")
                    .build();
        }

        // En production, lire le vrai crontab
        try {
            ProcessBuilder pb = new ProcessBuilder("crontab", "-l");
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;

            while ((line = reader.readLine()) != null) {
                // Chercher la ligne contenant "renew-cert.sh"
                if (line.contains("renew-cert.sh") && !line.trim().startsWith("#")) {
                    String[] parts = line.split("\\s+", 6);

                    if (parts.length >= 6) {
                        String cronExpr = String.join(" ", parts[0], parts[1], parts[2], parts[3], parts[4]);
                        String command = parts[5].split(">>")[0].trim();
                        String logFile = parts[5].contains(">>") ? parts[5].split(">>")[1].split("2>&1")[0].trim() : "";

                        return CrontabInfoDTO.builder()
                                .cronExpression(cronExpr)
                                .description(cronToHumanReadable(cronExpr))
                                .command(command)
                                .logFile(logFile)
                                .nextExecution(calculateNextExecution(cronExpr))
                                .isActive(true)
                                .environment("production")
                                .build();
                    }
                }
            }

            reader.close();
            process.waitFor();

        } catch (Exception e) {
            log.error("❌ Erreur lors de la lecture du crontab: {}", e.getMessage());
        }

        // Retour par défaut si non trouvé
        return CrontabInfoDTO.builder()
                .cronExpression("N/A")
                .description("Aucune planification trouvée")
                .command("N/A")
                .isActive(false)
                .environment(activeProfile)
                .build();
    }

    /**
     * Convertit une expression cron en texte lisible
     */
    private String cronToHumanReadable(String cronExpr) {
        String[] parts = cronExpr.split("\\s+");
        if (parts.length < 5) return cronExpr;

        String minute = parts[0];
        String hour = parts[1];
        String dayOfMonth = parts[2];
        String month = parts[3];
        String dayOfWeek = parts[4];

        StringBuilder description = new StringBuilder();

        // Fréquence
        if ("*".equals(dayOfMonth) && "*".equals(month) && "*".equals(dayOfWeek)) {
            description.append("Tous les jours");
        } else if (!"*".equals(dayOfWeek)) {
            description.append("Tous les ").append(getDayName(dayOfWeek));
        } else if (!"*".equals(dayOfMonth)) {
            description.append("Le ").append(dayOfMonth).append(" de chaque mois");
        }

        // Heure
        description.append(" à ").append(hour).append("h");
        if (!"0".equals(minute)) {
            description.append(minute);
        }

        return description.toString();
    }

    private String getDayName(String dayOfWeek) {
        switch (dayOfWeek) {
            case "0": case "7": return "dimanche";
            case "1": return "lundi";
            case "2": return "mardi";
            case "3": return "mercredi";
            case "4": return "jeudi";
            case "5": return "vendredi";
            case "6": return "samedi";
            default: return "jour";
        }
    }

    /**
     * Calcule la prochaine exécution estimée
     */
    private String calculateNextExecution(String cronExpr) {
        String[] parts = cronExpr.split("\\s+");
        if (parts.length < 2) return "N/A";

        try {
            int hour = Integer.parseInt(parts[1]);
            int minute = Integer.parseInt(parts[0]);

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime next = now.withHour(hour).withMinute(minute).withSecond(0);

            // Si l'heure est déjà passée aujourd'hui, passer à demain
            if (next.isBefore(now)) {
                next = next.plusDays(1);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            return next.format(formatter);

        } catch (Exception e) {
            return "N/A";
        }
    }

    /**
     * Récupère toutes les tâches cron (pour extension future)
     */
    public List<CrontabInfoDTO> getAllCronJobs() {
        List<CrontabInfoDTO> jobs = new ArrayList<>();
        jobs.add(getCertRenewalCronInfo());
        return jobs;
    }
}
