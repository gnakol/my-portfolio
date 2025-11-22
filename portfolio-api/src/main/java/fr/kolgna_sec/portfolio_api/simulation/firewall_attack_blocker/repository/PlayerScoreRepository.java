package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.repository;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.PlayerScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerScoreRepository extends JpaRepository<PlayerScore, Long> {

    Optional<PlayerScore> findBySession_SessionUuid(String sessionUuid);

    List<PlayerScore> findTop10ByOrderByFinalScoreDesc();

    @Query("SELECT p FROM PlayerScore p WHERE p.isTop10 = true ORDER BY p.finalScore DESC")
    List<PlayerScore> findTop10Leaderboard();

    @Query("SELECT COUNT(p) FROM PlayerScore p WHERE p.finalScore > :score")
    Long countScoresAbove(Integer score);
}
