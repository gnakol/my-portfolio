package fr.kolgna_sec.portfolio_api.visit.repositories;

import fr.kolgna_sec.portfolio_api.visit.bean.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    /**
     * Trouve toutes les visites entre deux dates
     */
    List<Visit> findByVisitDateBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Compte les visites par pays
     */
    @Query("SELECT v.country, COUNT(v) FROM Visit v WHERE v.country IS NOT NULL GROUP BY v.country ORDER BY COUNT(v) DESC")
    List<Object[]> countVisitsByCountry();

    /**
     * Compte les visites par page
     */
    @Query("SELECT v.pageUrl, COUNT(v) FROM Visit v GROUP BY v.pageUrl ORDER BY COUNT(v) DESC")
    List<Object[]> countVisitsByPage();

    /**
     * Trouve les visites récentes (dernières 24h)
     */
    @Query("SELECT v FROM Visit v WHERE v.visitDate >= :since ORDER BY v.visitDate DESC")
    List<Visit> findRecentVisits(@Param("since") LocalDateTime since);

    /**
     * Compte le nombre total de visites
     */
    @Query("SELECT COUNT(v) FROM Visit v")
    Long countTotalVisits();

    /**
     * Calcule la durée moyenne de session
     */
    @Query("SELECT AVG(v.sessionDuration) FROM Visit v WHERE v.sessionDuration > 0")
    Double calculateAverageSessionDuration();

    /**
     * Trouve les visites par device type
     */
    @Query("SELECT v.deviceType, COUNT(v) FROM Visit v WHERE v.deviceType IS NOT NULL GROUP BY v.deviceType")
    List<Object[]> countVisitsByDeviceType();

    /**
     * Trouve les visites par browser
     */
    @Query("SELECT v.browser, COUNT(v) FROM Visit v WHERE v.browser IS NOT NULL GROUP BY v.browser ORDER BY COUNT(v) DESC")
    List<Object[]> countVisitsByBrowser();

    /**
     * Trouve les top referrers
     */
    @Query("SELECT v.referrer, COUNT(v) FROM Visit v WHERE v.referrer IS NOT NULL AND v.referrer != '' GROUP BY v.referrer ORDER BY COUNT(v) DESC")
    List<Object[]> findTopReferrers();
}
