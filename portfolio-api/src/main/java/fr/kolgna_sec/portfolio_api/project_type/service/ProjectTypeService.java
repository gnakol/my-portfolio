package fr.kolgna_sec.portfolio_api.project_type.service;

import fr.kolgna_sec.portfolio_api.project_type.bean.ProjectType;
import fr.kolgna_sec.portfolio_api.project_type.dto.ProjectTypeDTO;
import fr.kolgna_sec.portfolio_api.project_type.mappers.ProjectTypeMapper;
import fr.kolgna_sec.portfolio_api.project_type.repositories.ProjectTypeRepository;
import fr.kolgna_sec.portfolio_api.uuid.service.UuidService;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectTypeService implements Webservices<ProjectTypeDTO> {

    private final ProjectTypeRepository projectTypeRepository;

    private final ProjectTypeMapper projectTypeMapper;

    private final UuidService uuidService;


    @Override
    public Page<ProjectTypeDTO> all(Pageable pageable) {
        return this.projectTypeRepository.findAll(pageable)
                .map(this.projectTypeMapper::fromProjectType);
    }

    @Override
    public ProjectTypeDTO add(ProjectTypeDTO e) {

        e.setRefProject(this.uuidService.generateUuid());
        return this.projectTypeMapper.fromProjectType(this.projectTypeRepository.save(this.projectTypeMapper.fromProjectTypeDTO(e)));
    }

    @Override
    public ProjectTypeDTO update(Long id, ProjectTypeDTO e) {
        return this.projectTypeRepository.findById(id)
                .map(existingProjectType -> {
                    Optional.ofNullable(e.getName()).ifPresent(existingProjectType::setName);

                    return this.projectTypeMapper.fromProjectType(this.projectTypeRepository.save(existingProjectType));
                })
                .orElseThrow(() -> new RuntimeException("Project type with ID : " +id+" was not found"));
    }

    @Override
    public void remove(Long id) {

        Optional<ProjectType> projectType = this.projectTypeRepository.findById(id);

        if (projectType.isEmpty())
            throw new RuntimeException("Project type with ID : " +id+ " was not found");

        this.projectTypeRepository.delete(projectType.get());

    }

    @Override
    public Optional<ProjectTypeDTO> getById(Long id) {
        return this.projectTypeRepository.findById(id)
                .map(this.projectTypeMapper::fromProjectType);
    }
}
