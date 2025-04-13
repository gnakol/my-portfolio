package fr.kolgna_sec.portfolio_api.skill.repositories;

import fr.kolgna_sec.portfolio_api.skill.bean.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    // Méthode unique avec @Query
    @Query("SELECT s FROM Skill s WHERE s.skillCategory.idSkillCategory = :categoryId")
    Page<Skill> findSkillsByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
}
