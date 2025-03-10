package fr.kolgna_sec.portfolio_api.simulation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SimulationDTO {

    private Long idSimulation;

    private String refSimulation;

    private String description;

    private String commandTest;

    private String expectedResult;

    private Long skillId;
}

