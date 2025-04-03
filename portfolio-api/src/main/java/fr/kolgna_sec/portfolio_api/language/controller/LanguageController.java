package fr.kolgna_sec.portfolio_api.language.controller;

import fr.kolgna_sec.portfolio_api.language.dto.LanguageDTO;
import fr.kolgna_sec.portfolio_api.language.service.LanguageService;
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
@RequestMapping("language")
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping("/all-language")
    public ResponseEntity<Page<LanguageDTO>> allLanguage(Pageable pageable)
    {
        return ResponseEntity.ok(this.languageService.all(pageable));
    }

    @GetMapping("/all-languages-for-cv")
    public ResponseEntity<List<LanguageDTO>> getAllLanguagesForCv() {
        return ResponseEntity.ok(this.languageService.getAllLanguages());
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/add-language")
    public ResponseEntity<LanguageDTO> addLanguage(@Validated @RequestBody LanguageDTO languageDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.languageService.add(languageDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/update-language/{idLanguage}")
    public ResponseEntity<LanguageDTO> updateLanguage(@Validated @PathVariable Long idLanguage, @RequestBody LanguageDTO languageDTO)
    {
        return ResponseEntity.status(202).body(this.languageService.update(idLanguage, languageDTO));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/remove-language/{idLanguage}")
    public ResponseEntity<String> removeLanguage(@Validated @PathVariable Long idLanguage)
    {
        this.languageService.remove(idLanguage);

        return ResponseEntity.status(202).body("Langage with ID : " +idLanguage+ " has been successfully remove");
    }

    @GetMapping("get-language-by-id/{idLanguage}")
    public ResponseEntity<LanguageDTO> getLanguageById(@Validated @PathVariable Long idLanguage)
    {
        return this.languageService.getById(idLanguage)
                .map(existingLanguage -> {
                    log.info("Language with ID : " +idLanguage+ " has been found");
                    return new ResponseEntity<>(existingLanguage, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Language with ID : " +idLanguage+ " was not found");
                    throw new RuntimeException("Unable to retrieve Language. Please check the provider ID");
                });
    }
}
