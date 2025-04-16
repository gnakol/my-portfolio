package fr.kolgna_sec.portfolio_api.project_type.mappers;

import fr.kolgna_sec.portfolio_api.project_type.bean.ProjectType;
import fr.kolgna_sec.portfolio_api.project_type.dto.ProjectTypeDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProjectTypeMapper {

    ProjectTypeDTO fromProjectType(ProjectType projectType);

    ProjectType fromProjectTypeDTO(ProjectTypeDTO projectTypeDTO);
}
