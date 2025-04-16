package fr.kolgna_sec.portfolio_api.project.repositories;

import fr.kolgna_sec.portfolio_api.project.bean.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
