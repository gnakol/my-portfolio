package fr.kolgna_sec.portfolio_api.monitoring.availability_status.repositories;

import fr.kolgna_sec.portfolio_api.monitoring.availability_status.bean.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface AvailabilityStatusRepository extends JpaRepository<AvailabilityStatus, Long> {
    Optional<AvailabilityStatus> findTopByOrderByCheckedAtDesc();
    List<AvailabilityStatus> findByCheckedAtAfter(Instant since);
    int deleteByCheckedAtBefore(Instant cutoff);
}

