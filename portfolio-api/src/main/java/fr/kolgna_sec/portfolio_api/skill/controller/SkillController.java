package fr.kolgna_sec.portfolio_api.skill.controller;

import fr.kolgna_sec.portfolio_api.skill.dto.SkillDTO;
import fr.kolgna_sec.portfolio_api.skill.service.SkillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("skill")
public class SkillController {

    private final SkillService skillService;

    @GetMapping("/all-skill")
    public ResponseEntity<Page<SkillDTO>> allSkill(Pageable pageable)
    {
        return ResponseEntity.ok(this.skillService.all(pageable));
    }

    // Endpoint dans SkillController
    @GetMapping("/all-skills-for-cv")
    public ResponseEntity<List<SkillDTO>> getAllSkillsForCv() {
        return ResponseEntity.ok(this.skillService.getAllSkills());
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/add-skill")
    public ResponseEntity<SkillDTO> addSkill(@Validated @RequestBody SkillDTO skillDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.skillService.add(skillDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/update-skill/{idSkill}")
    public ResponseEntity<SkillDTO> updateSkill(@Validated @PathVariable Long idSkill, @RequestBody SkillDTO skillDTO)
    {
        return ResponseEntity.status(202).body(this.skillService.update(idSkill, skillDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/remove-skill/{idSkill}")
    public ResponseEntity<String> removeSkill(@Validated @PathVariable Long idSkill)
    {
        this.skillService.remove(idSkill);
        return ResponseEntity.status(202).body("Skill with ID : " +idSkill+ " has been successfully remove");
    }

    @GetMapping("/get-by-id-skill/{idSkill}")
    public ResponseEntity<SkillDTO> getByIdSkill(@Validated @PathVariable Long idSkill)
    {
        return this.skillService.getById(idSkill)
                .map(skillDTO -> {
                    log.info("Skill with ID : " +idSkill+ " has been found");
                    return new ResponseEntity<>(skillDTO, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Skill with ID : {} was not found", idSkill);
                    throw new RuntimeException("Unable to retrieve Skill. Please check the provide ID");
                });
    }
}
