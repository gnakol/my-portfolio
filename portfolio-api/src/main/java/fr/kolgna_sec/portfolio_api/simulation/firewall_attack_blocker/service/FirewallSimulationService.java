package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.service;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.AttackEvent;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.FirewallSession;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.PlayerScore;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.dto.*;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.SessionStatus;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.repository.AttackEventRepository;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.repository.FirewallSessionRepository;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.repository.PlayerScoreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirewallSimulationService {

    private final FirewallSessionRepository sessionRepository;
    private final AttackEventRepository attackEventRepository;
    private final PlayerScoreRepository playerScoreRepository;
    private final ThreatIntelService threatIntelService;

    private static final int SCORE_PER_BLOCK = 50;
    private static final int SCORE_PENALTY_PER_MISS = -30;
    private static final BigDecimal MONEY_PER_SECOND = new BigDecimal("5000");

    /**
     * Démarre une nouvelle session de simulation
     */
    @Transactional
    public SessionStartResponseDTO startSession(SessionStartRequestDTO request) {
        // Créer la session
        FirewallSession session = FirewallSession.builder()
                .sessionUuid(UUID.randomUUID().toString())
                .visitorIp(request.getVisitorIp())
                .playerPseudo(request.getPlayerPseudo() != null ? request.getPlayerPseudo() : "Anonymous")
                .sessionStatus(SessionStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .finalScore(0)
                .attacksBlocked(0)
                .totalAttacks(0)
                .rulesCreated(0)
                .moneySaved(BigDecimal.ZERO)
                .build();

        session = sessionRepository.save(session);
        log.info("✅ New session started: {} for player: {}", session.getSessionUuid(), session.getPlayerPseudo());

        // Générer les attaques initiales
        List<AttackEvent> initialAttacks = threatIntelService.generateInitialAttackWave(session);
        attackEventRepository.saveAll(initialAttacks);

        session.setTotalAttacks(initialAttacks.size());
        sessionRepository.save(session);

        // Convertir en DTOs
        List<AttackEventDTO> attackDTOs = initialAttacks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return SessionStartResponseDTO.builder()
                .sessionUuid(session.getSessionUuid())
                .startedAt(session.getStartedAt())
                .scenario(threatIntelService.generateScenarioText())
                .initialAttacks(attackDTOs)
                .build();
    }

    /**
     * Exécute une règle firewall et bloque les attaques correspondantes
     */
    @Transactional
    public RuleExecutionResponseDTO executeFirewallRule(FirewallRuleDTO ruleDTO) {
        FirewallSession session = sessionRepository.findBySessionUuid(ruleDTO.getSessionUuid())
                .orElseThrow(() -> new RuntimeException("Session not found: " + ruleDTO.getSessionUuid()));

        if (session.getSessionStatus() != SessionStatus.IN_PROGRESS) {
            return RuleExecutionResponseDTO.builder()
                    .success(false)
                    .message("Session is not active")
                    .build();
        }

        // Récupérer les attaques non bloquées
        List<AttackEvent> activeAttacks = attackEventRepository
                .findBySession_SessionUuidAndIsBlocked(ruleDTO.getSessionUuid(), false);

        // Analyser la règle et bloquer les attaques correspondantes
        List<Long> blockedIds = new ArrayList<>();
        int attacksBlocked = 0;

        for (AttackEvent attack : activeAttacks) {
            if (ruleMatchesAttack(ruleDTO, attack)) {
                attack.setIsBlocked(true);
                attack.setBlockedByRule(ruleDTO.getRuleCommand());
                attack.setBlockedAt(LocalDateTime.now());
                attackEventRepository.save(attack);
                blockedIds.add(attack.getIdAttackEvent());
                attacksBlocked++;
            }
        }

        // Calculer le score gagné
        int scoreGained = attacksBlocked * SCORE_PER_BLOCK;
        session.setFinalScore(session.getFinalScore() + scoreGained);
        session.setAttacksBlocked(session.getAttacksBlocked() + attacksBlocked);
        session.setRulesCreated(session.getRulesCreated() + 1);
        sessionRepository.save(session);

        String message = attacksBlocked > 0 ?
                String.format("✅ Blocked %d attacks! +%d points", attacksBlocked, scoreGained) :
                "⚠️ No attacks matched this rule";

        log.info("🛡️ Rule executed: {} - Blocked: {} attacks", ruleDTO.getRuleCommand(), attacksBlocked);

        return RuleExecutionResponseDTO.builder()
                .success(true)
                .message(message)
                .attacksBlocked(attacksBlocked)
                .scoreGained(scoreGained)
                .currentScore(session.getFinalScore())
                .blockedAttackIds(blockedIds)
                .build();
    }

    /**
     * Termine la session et calcule le résultat final
     */
    @Transactional
    public SessionResultDTO endSession(SessionEndRequestDTO request) {
        FirewallSession session = sessionRepository.findBySessionUuid(request.getSessionUuid())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setEndedAt(LocalDateTime.now());
        session.setSessionStatus(SessionStatus.COMPLETED);
        session.setRating(request.getRating());
        session.setFeedback(request.getFeedback());

        // Calculer la durée
        Duration duration = Duration.between(session.getStartedAt(), session.getEndedAt());
        session.setDurationSeconds((int) duration.getSeconds());

        // Calculer l'argent économisé (moins de temps = plus d'argent sauvé)
        int secondsSaved = Math.max(0, 60 - session.getDurationSeconds());
        session.setMoneySaved(MONEY_PER_SECOND.multiply(new BigDecimal(secondsSaved)));

        // Calculer le taux de blocage
        BigDecimal blockRate = session.getTotalAttacks() > 0 ?
                new BigDecimal(session.getAttacksBlocked())
                        .divide(new BigDecimal(session.getTotalAttacks()), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal(100))
                : BigDecimal.ZERO;

        // Déterminer le grade
        String grade = calculateGrade(blockRate);
        session.setGrade(grade);

        sessionRepository.save(session);

        // Sauvegarder dans le leaderboard
        PlayerScore playerScore = PlayerScore.builder()
                .session(session)
                .playerPseudo(session.getPlayerPseudo())
                .finalScore(session.getFinalScore())
                .grade(grade)
                .completionTimeSeconds(session.getDurationSeconds())
                .attacksBlocked(session.getAttacksBlocked())
                .totalAttacks(session.getTotalAttacks())
                .blockRate(blockRate)
                .rating(request.getRating())
                .build();

        playerScoreRepository.save(playerScore);

        // Mettre à jour le flag TOP 10
        updateTop10Flags();

        // Recharger playerScore pour obtenir le bon flag isTop10
        playerScore = playerScoreRepository.findById(playerScore.getIdPlayerScore())
                .orElse(playerScore);

        // Calculer le rang dans le classement
        Long betterScores = playerScoreRepository.countScoresAbove(session.getFinalScore());
        int rank = betterScores.intValue() + 1;

        // Vérifier si le joueur a vraiment joué (au moins 5 secondes et 1 règle créée)
        boolean hasActuallyPlayed = session.getDurationSeconds() >= 5 && session.getRulesCreated() > 0;
        boolean isTop10 = playerScore.getIsTop10() && hasActuallyPlayed;

        log.info("🏁 Session ended: {} - Score: {} - Grade: {} - Rank: {} - HasPlayed: {}",
                session.getSessionUuid(), session.getFinalScore(), grade, rank, hasActuallyPlayed);

        return SessionResultDTO.builder()
                .sessionUuid(session.getSessionUuid())
                .finalScore(session.getFinalScore())
                .grade(grade)
                .attacksBlocked(session.getAttacksBlocked())
                .totalAttacks(session.getTotalAttacks())
                .blockRate(blockRate.setScale(2, RoundingMode.HALF_UP))
                .durationSeconds(session.getDurationSeconds())
                .moneySaved(session.getMoneySaved())
                .rulesCreated(session.getRulesCreated())
                .isTop10(isTop10)
                .leaderboardRank(rank)
                .build();
    }

    /**
     * Récupère le Top 10 du leaderboard
     */
    public List<LeaderboardEntryDTO> getLeaderboard() {
        List<PlayerScore> topScores = playerScoreRepository.findTop10ByOrderByFinalScoreDesc();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return topScores.stream()
                .map(score -> LeaderboardEntryDTO.builder()
                        .rank(topScores.indexOf(score) + 1)
                        .playerPseudo(score.getPlayerPseudo())
                        .finalScore(score.getFinalScore())
                        .grade(score.getGrade())
                        .blockRate(score.getBlockRate())
                        .completionTimeSeconds(score.getCompletionTimeSeconds())
                        .achievedAt(score.getAchievedAt().format(formatter))
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Vérifie si une règle correspond à une attaque
     */
    private boolean ruleMatchesAttack(FirewallRuleDTO rule, AttackEvent attack) {
        // Règle par IP
        if (rule.getTargetIp() != null && rule.getTargetIp().equals(attack.getSourceIp())) {
            return true;
        }

        // Règle par Port + Protocol
        if (rule.getTargetPort() != null && rule.getProtocol() != null) {
            return rule.getTargetPort().equals(attack.getTargetPort()) &&
                    rule.getProtocol().equalsIgnoreCase(attack.getProtocol().name());
        }

        // Règle par Port uniquement
        if (rule.getTargetPort() != null) {
            return rule.getTargetPort().equals(attack.getTargetPort());
        }

        return false;
    }

    /**
     * Calcule le grade en fonction du taux de blocage
     */
    private String calculateGrade(BigDecimal blockRate) {
        if (blockRate.compareTo(new BigDecimal(90)) >= 0) return "Elite Blue Teamer";
        if (blockRate.compareTo(new BigDecimal(70)) >= 0) return "Senior SOC Analyst";
        if (blockRate.compareTo(new BigDecimal(50)) >= 0) return "SOC Analyst";
        return "Junior SOC";
    }

    /**
     * Met à jour les flags is_top_10 manuellement (comme le trigger SQL n'a pas marché)
     */
    private void updateTop10Flags() {
        // Reset tous les flags
        List<PlayerScore> allScores = playerScoreRepository.findAll();
        allScores.forEach(score -> score.setIsTop10(false));
        playerScoreRepository.saveAll(allScores);

        // Set les 10 meilleurs
        List<PlayerScore> top10 = playerScoreRepository.findTop10ByOrderByFinalScoreDesc();
        top10.forEach(score -> score.setIsTop10(true));
        playerScoreRepository.saveAll(top10);
    }

    /**
     * Convertit AttackEvent en DTO
     */
    private AttackEventDTO convertToDTO(AttackEvent attack) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return AttackEventDTO.builder()
                .id(attack.getIdAttackEvent())
                .attackType(attack.getAttackType().name())
                .sourceIp(attack.getSourceIp())
                .sourceCountry(attack.getSourceCountry())
                .targetPort(attack.getTargetPort())
                .protocol(attack.getProtocol().name())
                .requestsPerSecond(attack.getRequestsPerSecond())
                .severity(attack.getSeverity().name())
                .isBlocked(attack.getIsBlocked())
                .detectedAt(attack.getDetectedAt().format(formatter))
                .build();
    }
}
