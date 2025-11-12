package fr.kolgna_sec.portfolio_api.simulation_vlan.repositories;

import fr.kolgna_sec.portfolio_api.simulation_vlan.bean.SimulationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulationSessionRepository extends JpaRepository<SimulationSession, Long> {
}
