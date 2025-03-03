package fr.kolgna_sec.portfolio_api.experience.controller;

import fr.kolgna_sec.portfolio_api.experience.dto.ExperienceDTO;
import fr.kolgna_sec.portfolio_api.experience.service.ExperienceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("experience")
public class ExperienceController {

    private final ExperienceService experienceService;

    @GetMapping("/all-experience")
    public ResponseEntity<Page<ExperienceDTO>> allExperience(Pageable pageable)
    {
        return ResponseEntity.ok(this.experienceService.all(pageable));
    }

    // Endpoint dans ExperienceController pour les Expériences
    @GetMapping("/all-experiences-for-cv")
    public ResponseEntity<List<ExperienceDTO>> getAllNonProjectExperiencesForCv() {
        return ResponseEntity.ok(this.experienceService.getAllNonProjectExperiences());
    }


    // Endpoint dans ExperienceController pour les Projets
    @GetMapping("/all-projects-for-cv")
    public ResponseEntity<List<ExperienceDTO>> getAllProjectsForCv() {
        return ResponseEntity.ok(this.experienceService.getAllProjects());
    }



    @PostMapping("/add-experience")
    public ResponseEntity<ExperienceDTO> addExperience(@Validated @RequestBody ExperienceDTO experienceDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.experienceService.add(experienceDTO));
    }

    @PutMapping("/update-experience/{idExperience}")
    public ResponseEntity<ExperienceDTO> updateExperience(@Validated @PathVariable Long idExperience, @RequestBody ExperienceDTO experienceDTO)
    {
        return ResponseEntity.status(202).body(this.experienceService.update(idExperience, experienceDTO));
    }

    @DeleteMapping("/remove-experience/{idExperience}")
    public ResponseEntity<String> removeExperience(@Validated @PathVariable Long idExperience)
    {
        this.experienceService.remove(idExperience);

        return ResponseEntity.status(202).body("Experience with ID : " +idExperience+ " has been successfully remove");
    }

    @GetMapping("/get-by-id-experience/{idExperience}")
    public ResponseEntity<ExperienceDTO> getByIdExperience(@Validated @PathVariable Long idExperience)
    {
        return this.experienceService.getById(idExperience)
                .map(experienceDTO -> {
                    log.info("Experience with ID : " +idExperience+ " has been found");
                    return new ResponseEntity<>(experienceDTO, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Experience with ID : " +idExperience+ " was not found");
                    throw new RuntimeException("Unable to retrieve Experience. Please check the provide ID");
                });
    }
}
