package fr.kolgna_sec.portfolio_api.simulation_vlan.controller;

import fr.kolgna_sec.portfolio_api.simulation_vlan.dto.*;
import fr.kolgna_sec.portfolio_api.simulation_vlan.service.VlanSimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("simulation")
@RequiredArgsConstructor
@Slf4j
public class VlanSessionController {

    private final VlanSimulationService vlanSimulationService;

    @PostMapping("/session/start")
    public ResponseEntity<StartSessionResponse> startSession(@Valid @RequestBody StartSessionRequest request) {
        log.info("POST /simulation/session/start - type: {}", request.getType());
        StartSessionResponse response = vlanSimulationService.startSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/session/{sessionId}/command")
    public ResponseEntity<SendCommandResponse> sendCommand(
            @PathVariable Long sessionId,
            @Valid @RequestBody SendCommandRequest request) {
        log.info("POST /simulation/session/{}/command - cmd: {}", sessionId, request.getRawCommand());
        SendCommandResponse response = vlanSimulationService.sendCommand(sessionId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/session/{sessionId}/finish")
    public ResponseEntity<FinishSessionResponse> finishSession(@PathVariable Long sessionId) {
        log.info("POST /simulation/session/{}/finish", sessionId);
        FinishSessionResponse response = vlanSimulationService.finishSession(sessionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/session/{sessionId}/feedback")
    public ResponseEntity<SaveFeedbackResponse> saveFeedback(
            @PathVariable Long sessionId,
            @Valid @RequestBody SaveFeedbackRequest request) {
        log.info("POST /simulation/session/{}/feedback - type: {}", sessionId, request.getFeedbackType());
        SaveFeedbackResponse response = vlanSimulationService.saveFeedback(sessionId, request);
        return ResponseEntity.ok(response);
    }
}
