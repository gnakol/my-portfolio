package fr.kolgna_sec.portfolio_api.feedback.repositories;

import fr.kolgna_sec.portfolio_api.feedback.bean.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
