package fr.kolgna_sec.portfolio_api.language.repositories;

import fr.kolgna_sec.portfolio_api.language.bean.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
}
