package fr.kolgna_sec.portfolio_api.monitoring.security_status.repositories;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.bean.SecurityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface SecurityStatusRepository extends JpaRepository<SecurityStatus, Long> {

    List<SecurityStatus> findTop5ByKindOrderByCheckedAtDesc(String kind);
    List<SecurityStatus> findByKindOrderByCheckedAtDesc(String kind);
    int deleteByCheckedAtBefore(Instant cutoff);
}
