package fr.kolgna_sec.portfolio_api.simulation_vlan.repositories;

import fr.kolgna_sec.portfolio_api.simulation_vlan.bean.SimulationCommand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationCommandRepository extends JpaRepository<SimulationCommand, Long> {
    List<SimulationCommand> findBySessionIdOrderByTimestampAsc(Long sessionId);
}
