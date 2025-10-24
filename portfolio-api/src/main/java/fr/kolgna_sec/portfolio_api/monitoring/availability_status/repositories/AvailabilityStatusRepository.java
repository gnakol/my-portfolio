package fr.kolgna_sec.portfolio_api.monitoring.availability_status.repositories;

import fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface AvailabilityStatusRepository extends JpaRepository<AvailabilityStatus, Long> {
    Optional<AvailabilityStatus> findTopByOrderByCheckedAtDesc();
    int deleteByCheckedAtBefore(Instant cutoff);
}

