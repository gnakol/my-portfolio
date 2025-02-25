package fr.kolgna_sec.portfolio_api.hobbies.controller;

import fr.kolgna_sec.portfolio_api.hobbies.dto.HobbiesDTO;
import fr.kolgna_sec.portfolio_api.hobbies.service.HobbiesService;
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
@RequestMapping("hobbies")
public class HobbiesController {

    private final HobbiesService hobbiesService;

    @GetMapping("/all-hobbies")
    public ResponseEntity<Page<HobbiesDTO>> allHobbies(Pageable pageable)
    {
        return ResponseEntity.ok(this.hobbiesService.all(pageable));
    }

    @PostMapping("/add-hobbies")
    public ResponseEntity<HobbiesDTO> addHobby(@Validated @RequestBody HobbiesDTO hobbiesDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.hobbiesService.add(hobbiesDTO));
    }

    @PutMapping("/update-hobbies/{idHobbies}")
    public ResponseEntity<HobbiesDTO> updateHobbies(@Validated @PathVariable Long idHobbies, @RequestBody HobbiesDTO hobbiesDTO)
    {
        return ResponseEntity.status(202).body(this.hobbiesService.update(idHobbies, hobbiesDTO));
    }

    @DeleteMapping("/remove-hobbies/{idHobbies}")
    public ResponseEntity<String> removeHobbies(@Validated @PathVariable Long idHobbies)
    {
        this.hobbiesService.remove(idHobbies);

        return ResponseEntity.status(202).body("Hobbies with id : " +idHobbies+ " has been successfully remove");
    }

    @GetMapping("/get-by-id-hobbies/{idHobbies}")
    public ResponseEntity<HobbiesDTO> getByIdHobbies(@Validated @PathVariable Long idHobbies)
    {
        return this.hobbiesService.getById(idHobbies)
                .map(hobbiesDTO -> {
                    log.info("Hobbies with id " +idHobbies+ " has been found");
                    return new ResponseEntity<>(hobbiesDTO, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Hobbies with ID " +idHobbies+ " was not found");
                    throw new RuntimeException("Unable to retrieve Hobbies. Please check the provider ID");
                });
    }
}
