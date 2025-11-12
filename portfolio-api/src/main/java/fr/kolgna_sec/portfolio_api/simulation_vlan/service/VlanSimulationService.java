package fr.kolgna_sec.portfolio_api.simulation_vlan.service;

import fr.kolgna_sec.portfolio_api.simulation_vlan.bean.SimulationCommand;
import fr.kolgna_sec.portfolio_api.simulation_vlan.bean.SimulationFeedback;
import fr.kolgna_sec.portfolio_api.simulation_vlan.bean.SimulationSession;
import fr.kolgna_sec.portfolio_api.simulation_vlan.dto.*;
import fr.kolgna_sec.portfolio_api.simulation_vlan.enumeration.CommandStatus;
import fr.kolgna_sec.portfolio_api.simulation_vlan.repositories.SimulationCommandRepository;
import fr.kolgna_sec.portfolio_api.simulation_vlan.repositories.SimulationFeedbackRepository;
import fr.kolgna_sec.portfolio_api.simulation_vlan.repositories.SimulationSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VlanSimulationService {

    private final SimulationSessionRepository sessionRepository;
    private final SimulationCommandRepository commandRepository;
    private final SimulationFeedbackRepository feedbackRepository;

    // Définition des steps VLAN (même logique que le front)
    private static final String[][] VLAN_STEPS = {
        {"vlan 10 VLAN-IT", "vlan10Created"},
        {"vlan 20 VLAN-Finance", "vlan20Created"},
        {"interface fa0/1", "port1Selected"},
        {"switchport mode access", "port1AccessMode"},
        {"switchport access vlan 10", "port1AssignedVlan10"}
    };

    @Transactional
    public StartSessionResponse startSession(StartSessionRequest request) {
        log.info("Starting new simulation session: type={}, clientHash={}", request.getType(), request.getClientHash());

        SimulationSession session = SimulationSession.builder()
            .type(request.getType())
            .clientHash(request.getClientHash())
            .userAgent(request.getUserAgent())
            .startedAt(LocalDateTime.now())
            .build();

        session = sessionRepository.save(session);

        return StartSessionResponse.builder()
            .sessionId(session.getId())
            .startedAt(session.getStartedAt().toString())
            .build();
    }

    @Transactional
    public SendCommandResponse sendCommand(Long sessionId, SendCommandRequest request) {
        SimulationSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

        if (session.getFinishedAt() != null) {
            return SendCommandResponse.builder()
                .status("KO")
                .message("Session déjà terminée")
                .build();
        }

        // Récupérer les commandes précédentes pour déterminer le step actuel
        List<SimulationCommand> previousCommands = commandRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        int currentStepIndex = (int) previousCommands.stream()
            .filter(cmd -> cmd.getStatus() == CommandStatus.OK)
            .count();

        String rawCmd = request.getRawCommand().trim().toLowerCase();
        CommandStatus status;
        String message;
        String animationCue = null;

        if (currentStepIndex >= VLAN_STEPS.length) {
            status = CommandStatus.KO;
            message = "Toutes les étapes sont déjà complétées";
        } else {
            String expectedCmd = VLAN_STEPS[currentStepIndex][0].toLowerCase();

            if (rawCmd.equals(expectedCmd)) {
                status = CommandStatus.OK;
                animationCue = VLAN_STEPS[currentStepIndex][1];
                message = "✅ Commande validée ! Étape " + (currentStepIndex + 1) + "/" + VLAN_STEPS.length;
                currentStepIndex++;
            } else {
                status = CommandStatus.KO;
                message = "❌ Commande incorrecte. Attendu: " + VLAN_STEPS[currentStepIndex][0];
            }
        }

        // Enregistrer la commande
        SimulationCommand command = SimulationCommand.builder()
            .session(session)
            .rawCommand(request.getRawCommand())
            .status(status)
            .stepIndex(currentStepIndex)
            .note(message)
            .timestamp(LocalDateTime.now())
            .build();

        commandRepository.save(command);

        log.info("Command processed: sessionId={}, cmd={}, status={}, stepIndex={}",
            sessionId, rawCmd, status, currentStepIndex);

        return SendCommandResponse.builder()
            .status(status.name())
            .stepIndex(currentStepIndex)
            .message(message)
            .animationCue(animationCue)
            .build();
    }

    @Transactional
    public FinishSessionResponse finishSession(Long sessionId) {
        SimulationSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

        if (session.getFinishedAt() != null) {
            return FinishSessionResponse.builder()
                .score(session.getScore())
                .durationMs(session.getDurationMs())
                .success(session.getSuccess())
                .build();
        }

        session.setFinishedAt(LocalDateTime.now());

        // Calculer la durée
        long durationMs = Duration.between(session.getStartedAt(), session.getFinishedAt()).toMillis();
        session.setDurationMs(durationMs);

        // Calculer le score
        List<SimulationCommand> commands = commandRepository.findBySessionIdOrderByTimestampAsc(sessionId);
        long okCommands = commands.stream().filter(cmd -> cmd.getStatus() == CommandStatus.OK).count();
        long koCommands = commands.stream().filter(cmd -> cmd.getStatus() == CommandStatus.KO).count();

        boolean success = okCommands == VLAN_STEPS.length;
        int score = calculateScore((int) okCommands, (int) koCommands, durationMs);

        session.setScore(score);
        session.setSuccess(success);

        sessionRepository.save(session);

        log.info("Session finished: sessionId={}, score={}, success={}, duration={}ms",
            sessionId, score, success, durationMs);

        return FinishSessionResponse.builder()
            .score(score)
            .durationMs(durationMs)
            .success(success)
            .build();
    }

    @Transactional
    public SaveFeedbackResponse saveFeedback(Long sessionId, SaveFeedbackRequest request) {
        SimulationSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));

        SimulationFeedback feedback = SimulationFeedback.builder()
            .session(session)
            .experienceName(request.getExperienceName())
            .feedbackType(request.getFeedbackType())
            .feedbackValue(request.getFeedbackValue())
            .timestamp(LocalDateTime.now())
            .build();

        feedbackRepository.save(feedback);

        log.info("Feedback saved: sessionId={}, type={}", sessionId, request.getFeedbackType());

        return SaveFeedbackResponse.builder()
            .ok(true)
            .build();
    }

    private int calculateScore(int okCommands, int koCommands, long durationMs) {
        // Score de base: 100 points par commande OK
        int baseScore = okCommands * 100;

        // Pénalité pour les erreurs: -20 points par KO
        int penalty = koCommands * 20;

        // Bonus vitesse: si < 2min -> bonus 50, < 5min -> bonus 20
        int timeBonus = 0;
        if (durationMs < 120000) { // 2 minutes
            timeBonus = 50;
        } else if (durationMs < 300000) { // 5 minutes
            timeBonus = 20;
        }

        int finalScore = Math.max(0, baseScore - penalty + timeBonus);

        return finalScore;
    }
}
