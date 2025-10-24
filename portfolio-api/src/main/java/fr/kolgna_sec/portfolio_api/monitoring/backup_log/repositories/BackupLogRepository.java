package fr.kolgna_sec.portfolio_api.monitoring.backup_log.repositories;

import fr.kolgna_sec.portfolio_api.monitoring.backup_log.bean.BackupLog;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface BackupLogRepository extends JpaRepository<BackupLog, Long> {
    Optional<BackupLog> findTopByOrderByRanAtDesc();

    @Modifying
    @Transactional
    int deleteByRanAtBefore(Instant cutoff);
}

