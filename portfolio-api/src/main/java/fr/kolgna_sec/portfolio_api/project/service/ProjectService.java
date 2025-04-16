package fr.kolgna_sec.portfolio_api.project.service;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.repositories.AccountRepository;
import fr.kolgna_sec.portfolio_api.project.bean.Project;
import fr.kolgna_sec.portfolio_api.project.repositories.ProjectRepository;
import fr.kolgna_sec.portfolio_api.project.dto.ProjectDTO;
import fr.kolgna_sec.portfolio_api.project.mappers.ProjectMapper;
import fr.kolgna_sec.portfolio_api.project_type.bean.ProjectType;
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
public class ProjectService implements Webservices<ProjectDTO> {

    private final ProjectRepository projectRepository;

    private final ProjectMapper projectMapper;

    private final AccountRepository accountRepository;

    private final ProjectTypeRepository projectTypeRepository;

    private final UuidService uuidService;

    @Override
    public Page<ProjectDTO> all(Pageable pageable) {
        return this.projectRepository.findAll(pageable)
                .map(this.projectMapper::fromProject);
    }

    @Override
    public ProjectDTO add(ProjectDTO e) {

        Project project = this.projectMapper.fromProjectDTO(e);

        Optional<Account> account = this.accountRepository.findById(e.getAccountId());
        Optional<ProjectType> projectType = this.projectTypeRepository.findById(e.getProjectTypeId());

        if (account.isPresent() && projectType.isPresent())
        {
            project.setRefProject(this.uuidService.generateUuid());
            project.setAccount(account.get());
            project.setProjectType(projectType.get());

            return this.projectMapper.fromProject(this.projectRepository.save(project));
        }
        throw new RuntimeException("Unable to retrieve Account and Project type.");
    }

    @Override
    public ProjectDTO update(Long id, ProjectDTO e) {

        Optional<Account> account = this.accountRepository.findById(e.getAccountId());
        Optional<ProjectType> projectType = this.projectTypeRepository.findById(e.getProjectTypeId());

        return this.projectRepository.findById(id)
                .map(existingProject -> {
                    Optional.ofNullable(e.getTitle()).ifPresent(existingProject::setTitle);
                    Optional.ofNullable(e.getDescription()).ifPresent(existingProject::setDescription);
                    Optional.ofNullable(e.getStartDate()).ifPresent(existingProject::setStartDate);
                    Optional.ofNullable(e.getEndDate()).ifPresent(existingProject::setEndDate);
                    Optional.ofNullable(e.getSkillsDevelopment()).ifPresent(existingProject::setSkillsDevelopment);
                    Optional.of(account.get()).ifPresent(existingProject::setAccount);
                    Optional.of(projectType.get()).ifPresent(existingProject::setProjectType);

                    return this.projectMapper.fromProject(this.projectRepository.save(existingProject));
                })
                .orElseThrow(() -> new RuntimeException("Account and Project type with ID was not found "));
    }

    @Override
    public void remove(Long id) {

        Optional<Project> project = this.projectRepository.findById(id);

        if (project.isEmpty())
            throw new RuntimeException("Project with Id : " +id+ " was not found");

        this.projectRepository.delete(project.get());

    }

    @Override
    public Optional<ProjectDTO> getById(Long id) {
        return this.projectRepository.findById(id)
                .map(this.projectMapper::fromProject);
    }
}
