package fr.kolgna_sec.portfolio_api.skill_categori.controller;

import fr.kolgna_sec.portfolio_api.skill_categori.dto.SkillCategoryDTO;
import fr.kolgna_sec.portfolio_api.skill_categori.service.SkillCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("skill-category")
public class SkillCategoryController {

    private final SkillCategoryService skillCategoryService;

    @GetMapping("/all-skill-category")
    public ResponseEntity<Page<SkillCategoryDTO>> all(Pageable pageable)
    {
        return ResponseEntity.ok(this.skillCategoryService.all(pageable));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/add-skill-category")
    public ResponseEntity<SkillCategoryDTO> addSkillCategory(@Validated @RequestBody SkillCategoryDTO skillCategoryDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.skillCategoryService.add(skillCategoryDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/update-skill-category/{idSkillCategory}")
    public ResponseEntity<SkillCategoryDTO> updateSkillCategory(@Validated @PathVariable Long idSkillCategory, @RequestBody SkillCategoryDTO skillCategoryDTO)
    {
        return ResponseEntity.status(202).body(this.skillCategoryService.update(idSkillCategory, skillCategoryDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/remove-skill-category/{idSkillCategory}")
    public ResponseEntity<String> removeSkillCategory(@Validated @PathVariable Long idSkillCategory)
    {
        this.skillCategoryService.remove(idSkillCategory);

        return ResponseEntity.status(202).body("Skill Category with ID : " +idSkillCategory+ " has been successfully remove");
    }

    @GetMapping("/get-by-id-skill-category/{idSkillCategory}")
    public ResponseEntity<SkillCategoryDTO> getByIdSkillCategory(@Validated @PathVariable Long idSkillCategory)
    {
        return this.skillCategoryService.getById(idSkillCategory)
                .map(skillCategoryDTO -> {
                    log.info(" Skill Category with ID " +idSkillCategory+ " has been found");
                    return new ResponseEntity<>(skillCategoryDTO, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error(" Skill Category with ID : " +idSkillCategory+ " was not found");
                    throw new RuntimeException("Unable to retrieve Skill Category. Please check provide ID");
                });
    }
}
