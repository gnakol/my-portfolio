package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface SystemHealthRepository extends JpaRepository<SystemHealthSnapshot, Long> {

    /**
     * Récupère les snapshots des X dernières heures
     */
    List<SystemHealthSnapshot> findByTimestampAfterOrderByTimestampAsc(Instant since);

    /**
     * Supprime les snapshots antérieurs à une date
     */
    void deleteByTimestampBefore(Instant cutoff);

    /**
     * Compte les snapshots
     */
    @Query("SELECT COUNT(s) FROM SystemHealthSnapshot s")
    Long countAll();
}
