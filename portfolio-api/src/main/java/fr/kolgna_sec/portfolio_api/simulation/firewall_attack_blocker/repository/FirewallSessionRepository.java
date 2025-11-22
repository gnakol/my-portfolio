package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.repository;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.FirewallSession;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FirewallSessionRepository extends JpaRepository<FirewallSession, Long> {

    Optional<FirewallSession> findBySessionUuid(String sessionUuid);

    Long countBySessionStatus(SessionStatus status);
}
