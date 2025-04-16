package fr.kolgna_sec.portfolio_api.project_type.repositories;

import fr.kolgna_sec.portfolio_api.project_type.bean.ProjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectTypeRepository extends JpaRepository<ProjectType, Long> {
}
