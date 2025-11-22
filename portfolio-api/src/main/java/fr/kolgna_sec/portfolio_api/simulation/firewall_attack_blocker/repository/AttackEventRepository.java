package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.repository;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.AttackEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttackEventRepository extends JpaRepository<AttackEvent, Long> {

    List<AttackEvent> findBySession_SessionUuid(String sessionUuid);

    List<AttackEvent> findBySession_SessionUuidAndIsBlocked(String sessionUuid, Boolean isBlocked);

    @Query("SELECT COUNT(a) FROM AttackEvent a WHERE a.session.sessionUuid = :sessionUuid AND a.isBlocked = true")
    Long countBlockedAttacksBySession(@Param("sessionUuid") String sessionUuid);

    @Query("SELECT COUNT(a) FROM AttackEvent a WHERE a.session.sessionUuid = :sessionUuid")
    Long countTotalAttacksBySession(@Param("sessionUuid") String sessionUuid);
}
