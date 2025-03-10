package fr.kolgna_sec.portfolio_api.simulation.controller;

import fr.kolgna_sec.portfolio_api.simulation.dto.SimulationDTO;
import fr.kolgna_sec.portfolio_api.simulation.service.SimulationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("simulation")
public class SimulationController {

    private final SimulationService simulationService;

    @PostMapping("/ping")
    public ResponseEntity<SimulationDTO> executePing(@RequestBody Map<String, String> request) {

        String ipAddress = request.get("ipAddress");

        return ResponseEntity.ok(simulationService.executePing(ipAddress));
    }

    @PostMapping("/vlan")
    public ResponseEntity<SimulationDTO> simulateVlanConfiguration(@RequestBody Map<String, String> request) {

        return ResponseEntity.ok(simulationService.simulateVlanConfiguration(request));
    }

    @PostMapping("/eigrp")
    public ResponseEntity<SimulationDTO> simulateEigrpConfiguration(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(simulationService.simulateEigrpConfiguration(request));
    }


}

