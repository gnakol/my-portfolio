package fr.kolgna_sec.portfolio_api.training.controller;

import fr.kolgna_sec.portfolio_api.training.dto.TrainingDTO;
import fr.kolgna_sec.portfolio_api.training.service.TrainingService;
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
@RequestMapping("training")
public class TrainingController {

    private final TrainingService trainingService;

    @GetMapping("all-training")
    public ResponseEntity<Page<TrainingDTO>> allTraining(Pageable pageable)
    {
        return ResponseEntity.ok(this.trainingService.all(pageable));
    }

    // Endpoint dans TrainingController
    @GetMapping("/all-trainings-for-cv")
    public ResponseEntity<List<TrainingDTO>> getAllTrainingsForCv() {
        return ResponseEntity.ok(this.trainingService.getAllTrainings());
    }


    @PostMapping("add-training")
    public ResponseEntity<TrainingDTO> addTraining(@Validated @RequestBody TrainingDTO trainingDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.trainingService.add(trainingDTO));
    }

    @PutMapping("update-training/{idAccount}")
    public ResponseEntity<TrainingDTO> updateTraining(@Validated @PathVariable Long idTraining, @RequestBody TrainingDTO trainingDTO)
    {
        return ResponseEntity.status(202).body(this.trainingService.update(idTraining, trainingDTO));
    }

    @DeleteMapping("remove-training/{idTraining}")
    public ResponseEntity<String> removeTraining(@Validated @PathVariable Long idTraining)
    {
        this.trainingService.remove(idTraining);

        return ResponseEntity.status(202).body("Training with ID : " +idTraining+ " has been successfully");
    }

    @GetMapping("get-by-id-training/{idTraining}")
    public ResponseEntity<TrainingDTO> getByIdTraining(@Validated @PathVariable Long idTraining)
    {
        return this.trainingService.getById(idTraining)
                .map(trainingDTO -> {
                    log.info("Training with ID : " +idTraining+ " has been found");
                    return new ResponseEntity<>(trainingDTO, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Training with ID : " +idTraining+ " was not found");
                    throw new RuntimeException("Unable to retrieve Training. Please check provide ID");
                });
    }


}
