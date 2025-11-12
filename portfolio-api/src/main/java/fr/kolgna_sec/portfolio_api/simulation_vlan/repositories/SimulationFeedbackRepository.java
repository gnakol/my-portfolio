package fr.kolgna_sec.portfolio_api.simulation_vlan.repositories;

import fr.kolgna_sec.portfolio_api.simulation_vlan.bean.SimulationFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulationFeedbackRepository extends JpaRepository<SimulationFeedback, Long> {
}
