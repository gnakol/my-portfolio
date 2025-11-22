package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.controller;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto.*;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.service.FirewallSimulationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulation/firewall")
//@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class FirewallSimulationController {

    private final FirewallSimulationService firewallSimulationService;

    /**
     * Démarre une nouvelle session de simulation
     * POST /api/simulation/firewall/start
     */
    @PostMapping("/start")
    public ResponseEntity<SessionStartResponseDTO> startSession(
            @RequestBody SessionStartRequestDTO request,
            HttpServletRequest httpRequest) {

        // Récupérer l'IP du visiteur si non fournie
        if (request.getVisitorIp() == null) {
            String clientIp = getClientIp(httpRequest);
            request.setVisitorIp(clientIp);
        }

        log.info("🚀 Starting new firewall simulation for player: {} from IP: {}",
                request.getPlayerPseudo(), request.getVisitorIp());

        SessionStartResponseDTO response = firewallSimulationService.startSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Exécute une règle firewall
     * POST /api/simulation/firewall/execute-rule
     */
    @PostMapping("/execute-rule")
    public ResponseEntity<RuleExecutionResponseDTO> executeRule(
            @RequestBody FirewallRuleDTO ruleDTO) {

        log.info("🛡️ Executing firewall rule: {} for session: {}",
                ruleDTO.getRuleCommand(), ruleDTO.getSessionUuid());

        RuleExecutionResponseDTO response = firewallSimulationService.executeFirewallRule(ruleDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Termine la session et sauvegarde le résultat
     * POST /api/simulation/firewall/end
     */
    @PostMapping("/end")
    public ResponseEntity<SessionResultDTO> endSession(
            @RequestBody SessionEndRequestDTO request) {

        log.info("🏁 Ending session: {} with rating: {}",
                request.getSessionUuid(), request.getRating());

        SessionResultDTO response = firewallSimulationService.endSession(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupère le classement Top 10
     * GET /api/simulation/firewall/leaderboard
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard() {
        log.info("📊 Fetching leaderboard");
        List<LeaderboardEntryDTO> leaderboard = firewallSimulationService.getLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }

    /**
     * Health check endpoint
     * GET /api/simulation/firewall/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Firewall Simulation API is running");
    }

    /**
     * Récupère l'IP réelle du client (même derrière un proxy)
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Si plusieurs IPs séparées par virgule, prendre la première
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
