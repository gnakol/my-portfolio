package fr.kolgna_sec.portfolio_api.simulation.repositories;

import fr.kolgna_sec.portfolio_api.simulation.bean.Simulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulationRepository extends JpaRepository<Simulation, Long> {
}
