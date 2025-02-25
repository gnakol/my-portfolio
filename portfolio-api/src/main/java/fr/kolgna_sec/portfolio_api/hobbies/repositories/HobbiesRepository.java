package fr.kolgna_sec.portfolio_api.hobbies.repositories;

import fr.kolgna_sec.portfolio_api.hobbies.bean.Hobbies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HobbiesRepository extends JpaRepository<Hobbies, Long> {
}
