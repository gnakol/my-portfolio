package fr.kolgna_sec.portfolio_api.project_type.controller;

import fr.kolgna_sec.portfolio_api.project_type.dto.ProjectTypeDTO;
import fr.kolgna_sec.portfolio_api.project_type.service.ProjectTypeService;
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
@RequestMapping("project-type")
@Slf4j
public class ProjectTypeController {

    private final ProjectTypeService projectTypeService;

    @GetMapping("/all-project-type")
    public ResponseEntity<Page<ProjectTypeDTO>> allProjectType(Pageable pageable)
    {
        return ResponseEntity.ok(this.projectTypeService.all(pageable));
    }

    @PostMapping("/add-project-type")
    public ResponseEntity<ProjectTypeDTO> addProjectType(@Validated @RequestBody ProjectTypeDTO projectTypeDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.projectTypeService.add(projectTypeDTO));
    }

    @PutMapping("/update-project-type/{idProjectType}")
    public ResponseEntity<ProjectTypeDTO> updateProjectType(@Validated @PathVariable Long idProjectType, @RequestBody ProjectTypeDTO projectTypeDTO)
    {
        return ResponseEntity.status(202).body(this.projectTypeService.update(idProjectType, projectTypeDTO));
    }

    @DeleteMapping("/remove-project-type/{idProjectType}")
    public ResponseEntity<String> removeProjectType(@Validated @PathVariable Long idProjectType)
    {
        this.projectTypeService.remove(idProjectType);
        return ResponseEntity.status(202).body("Project with ID : "+idProjectType+ " has been successfully remove");
    }

    @GetMapping("/get-project-type-by-id/{idProjectType}")
    public ResponseEntity<ProjectTypeDTO> getByIdProjectType(@Validated @PathVariable Long idProjectType)
    {
        return this.projectTypeService.getById(idProjectType)
                .map(existingProjectType -> {
                    log.info("Project with ID : " +idProjectType+ " has been found");
                    return new ResponseEntity<>(existingProjectType, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Project type with ID : " +idProjectType+ " was not found");
                    throw new RuntimeException("Unable to retrieve Project type. Please check the provider ID");
                });
    }
}
