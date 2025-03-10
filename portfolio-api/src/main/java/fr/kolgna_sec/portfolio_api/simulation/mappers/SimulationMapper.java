package fr.kolgna_sec.portfolio_api.simulation.mappers;

import fr.kolgna_sec.portfolio_api.simulation.bean.Simulation;
import fr.kolgna_sec.portfolio_api.simulation.dto.SimulationDTO;
import fr.kolgna_sec.portfolio_api.skill.mappers.SkillMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {SkillMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SimulationMapper {

    @Mapping(target = "skillId", source = "skill.idSkill")
    SimulationDTO fromSimulation(Simulation simulation);

    @Mapping(target = "skill.idSkill", source = "skillId")
    Simulation fromSimulationDTO(SimulationDTO simulationDTO);
}

