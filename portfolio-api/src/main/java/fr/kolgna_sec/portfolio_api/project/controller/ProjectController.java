package fr.kolgna_sec.portfolio_api.project.controller;

import fr.kolgna_sec.portfolio_api.project.bean.Project;
import fr.kolgna_sec.portfolio_api.project.dto.ProjectDTO;
import fr.kolgna_sec.portfolio_api.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("project")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/all-project")
    public ResponseEntity<Page<ProjectDTO>> allProject(Pageable pageable)
    {
        return ResponseEntity.ok().body(this.projectService.all(pageable));
    }

    @PostMapping("/add-project")
    public ResponseEntity<ProjectDTO> addProject(@Validated @RequestBody ProjectDTO projectDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.projectService.add(projectDTO));
    }

    @PutMapping("/update-project/{idProject}")
    public ResponseEntity<ProjectDTO> updateProject(@Validated @PathVariable Long idProject, @RequestBody ProjectDTO projectDTO)
    {
        return ResponseEntity.status(202).body(this.projectService.update(idProject, projectDTO));
    }

    @DeleteMapping("/remove-project/{idProject}")
    public ResponseEntity<String> removeProject(@Validated @PathVariable Long idProject)
    {
        this.projectService.remove(idProject);
        return ResponseEntity.status(202).body("Project with ID : " +idProject+ " has been successfully remove");
    }

    @GetMapping("/get-project-by-id/{idProject}")
    public ResponseEntity<ProjectDTO> getProjectById(@Validated @PathVariable Long idProject)
    {
        return this.projectService.getById(idProject)
                .map(existingProject -> {
                    log.info("Project with ID : " +idProject+ " has been found");
                    return new ResponseEntity<>(existingProject, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Project with ID : " +idProject+ " has been found");
                    throw new RuntimeException("Unable to retrieve Project. Please check the provider ID");
                });
    }
}
