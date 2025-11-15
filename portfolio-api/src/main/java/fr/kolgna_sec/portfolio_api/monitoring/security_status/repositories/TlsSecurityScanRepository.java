package fr.kolgna_sec.portfolio_api.monitoring.security_status.repositories;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.bean.TlsSecurityScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TlsSecurityScanRepository extends JpaRepository<TlsSecurityScan, Long> {

    List<TlsSecurityScan> findByTargetOrderByScannedAtDesc(String target);

    Optional<TlsSecurityScan> findFirstByTargetOrderByScannedAtDesc(String target);

    List<TlsSecurityScan> findAllByOrderByScannedAtDesc();

    List<TlsSecurityScan> findTop10ByOrderByScannedAtDesc();
}
