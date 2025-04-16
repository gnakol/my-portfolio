package fr.kolgna_sec.portfolio_api.project.mappers;

import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.project.bean.Project;
import fr.kolgna_sec.portfolio_api.project.dto.ProjectDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {ProjectMapper.class, AccountMapper.class}, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface ProjectMapper {

    @Mapping(target = "projectTypeId", source = "projectType.idProjectType")
    @Mapping(target = "accountId", source = "account.idAccount")
    ProjectDTO fromProject(Project project);

    @Mapping(target = "projectType.idProjectType", source = "projectTypeId")
    @Mapping(target = "account.idAccount", source = "accountId")
    Project fromProjectDTO(ProjectDTO projectDTO);
}
