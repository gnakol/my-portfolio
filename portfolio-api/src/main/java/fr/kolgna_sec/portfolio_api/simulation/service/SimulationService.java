package fr.kolgna_sec.portfolio_api.simulation.service;


import fr.kolgna_sec.portfolio_api.log_security.bean.LogSecurity;
import fr.kolgna_sec.portfolio_api.log_security.enumeration.LogType;
import fr.kolgna_sec.portfolio_api.log_security.repositories.LogSecurityRepository;
import fr.kolgna_sec.portfolio_api.simulation.dto.SimulationDTO;
import fr.kolgna_sec.portfolio_api.simulation.mappers.SimulationMapper;
import fr.kolgna_sec.portfolio_api.simulation.repositories.SimulationRepository;
import fr.kolgna_sec.portfolio_api.skill.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SimulationService {

    private final SimulationRepository simulationRepository;
    private final SimulationMapper simulationMapper;
    private final SkillRepository skillRepository;
    private final LogSecurityRepository logSecurityRepository;

    public SimulationDTO executePing(String ipAddress) {
        StringBuilder output = new StringBuilder();

        String os = null;
        try {
            os = System.getProperty("os.name").toLowerCase();
            //log.info("🖥️ Système d'exploitation détecté : {}", os);

            Process process;
            if (os.contains("win")) {
                // Commande pour Windows
                process = new ProcessBuilder("ping", "-n", "4", ipAddress).start();
            } else {
                // Commande pour Linux et macOS
                process = new ProcessBuilder("ping", "-c", "4", ipAddress).start();
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            process.waitFor();

            //log.info("✅ Commande ping exécutée avec succès.");
            //log.info("📄 Résultat du ping : \n{}", output.toString());

            logSecurityRepository.save(LogSecurity.builder()
                    .typeLog(LogType.EVENEMENT)
                    .message("Ping executed to IP: " + ipAddress)
                    .ipSource(ipAddress)
                    .build());

        } catch (Exception e) {
            output.append("Error: ").append(e.getMessage());
            log.error("❌ Erreur lors de l'exécution de la commande ping : {}", e.getMessage());
        }

        return SimulationDTO.builder()
                .description("Ping to " + ipAddress)
                .commandTest("ping " + (os.contains("win") ? "-n" : "-c") + " 4 " + ipAddress)
                .expectedResult(output.toString())
                .build();
    }

    public SimulationDTO simulateVlanConfiguration(Map<String, String> request) {

        String vlanId = request.get("vlanId");
        String vlanName = request.get("vlanName");
        StringBuilder output = new StringBuilder();
        LocalDateTime dateLog = LocalDateTime.now(); // Capture du temps exact de l'exécution

        try {
            // Simuler une configuration VLAN (exemple fictif)
            output.append("Configuration du VLAN :\n");
            output.append("vlan ").append(vlanId).append("\n");
            output.append("name ").append(vlanName).append("\n");
            output.append("VLAN ").append(vlanId).append(" configuré avec succès !\n");

            // Log en base de données
            logSecurityRepository.save(LogSecurity.builder()
                    .typeLog(LogType.EVENEMENT)
                    .message("VLAN configuré : ID=" + vlanId + ", Nom=" + vlanName)
                    .ipSource("localhost") // Ici, on peut mettre l'IP du client si nécessaire
                    .dateLog(dateLog)
                    .build());

        } catch (Exception e) {
            output.append("Erreur : ").append(e.getMessage());
            log.error("❌ Erreur lors de la simulation VLAN : {}", e.getMessage());
        }

        return SimulationDTO.builder()
                .description("Configuration du VLAN " + vlanId)
                .commandTest("vlan " + vlanId + " name " + vlanName)
                .expectedResult(output.toString())
                .build();
    }

    public SimulationDTO simulateEigrpConfiguration(Map<String, String> request) {
        String network = request.get("network");
        String wildcard = request.get("wildcard");
        String processId = request.get("processId");

        StringBuilder output = new StringBuilder();
        LocalDateTime dateLog = LocalDateTime.now();

        try {
            // Validation des entrées
            if (network == null || wildcard == null || processId == null) {
                throw new IllegalArgumentException("Les paramètres 'network', 'wildcard' et 'processId' sont requis.");
            }

            // Simulation EIGRP (exemple fictif)
            output.append("Configuration EIGRP :\n");
            output.append("router eigrp ").append(processId).append("\n");
            output.append("network ").append(network).append(" ").append(wildcard).append("\n");
            output.append("EIGRP configuré avec succès !\n");

            // Sauvegarde du log de sécurité
            logSecurityRepository.save(LogSecurity.builder()
                    .typeLog(LogType.EVENEMENT)
                    .message("EIGRP configuré : Process ID=" + processId + ", Network=" + network)
                    .ipSource("localhost")
                    .dateLog(dateLog)
                    .build());

            // Sauvegarde de la simulation
/*            SimulationDTO simulation = SimulationDTO.builder()
                    .description("Configuration EIGRP " + processId)
                    .commandTest("router eigrp " + processId + " network " + network + " " + wildcard)
                    .expectedResult(output.toString())
                    .build();
            this.simulationRepository.save(this.simulationMapper.fromSimulationDTO(simulation));*/

        } catch (Exception e) {
            output.append("Erreur : ").append(e.getMessage());
            log.error("❌ Erreur lors de la simulation EIGRP : {}", e.getMessage());

            // Sauvegarde du log d'erreur
            logSecurityRepository.save(LogSecurity.builder()
                    .typeLog(LogType.FAILLE)
                    .message("Erreur lors de la configuration EIGRP : " + e.getMessage())
                    .ipSource("localhost")
                    .dateLog(dateLog)
                    .build());
        }

        return SimulationDTO.builder()
                .description("Configuration EIGRP " + processId)
                .commandTest("router eigrp " + processId + " network " + network + " " + wildcard)
                .expectedResult(output.toString())
                .build();
    }
}

