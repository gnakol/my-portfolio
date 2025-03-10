package fr.kolgna_sec.portfolio_api.feedback.controller;

import fr.kolgna_sec.portfolio_api.feedback.dto.FeedbackDTO;
import fr.kolgna_sec.portfolio_api.feedback.service.FeedbackService;
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
@RequestMapping("feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping("all-feedback")
    public ResponseEntity<Page<FeedbackDTO>> allFeedBack(Pageable pageable)
    {
        return ResponseEntity.ok(this.feedbackService.all(pageable));
    }

    @PostMapping("add-feedback")
    public ResponseEntity<FeedbackDTO> addFeedback(@Validated @RequestBody FeedbackDTO feedbackDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.feedbackService.add(feedbackDTO));
    }

    @PutMapping("update-feedback/{idFeedback}")
    public ResponseEntity<FeedbackDTO> updateFeedback(@Validated @PathVariable Long idFeedback, @RequestBody FeedbackDTO feedbackDTO)
    {
        return ResponseEntity.status(202).body(this.feedbackService.update(idFeedback, feedbackDTO));
    }

    @DeleteMapping("remove-feedback")
    public ResponseEntity<String> removeFeedback(@Validated @PathVariable Long idFeedback)
    {
        this.feedbackService.remove(idFeedback);

        return ResponseEntity.status(202).body("Feedback with ID : " +idFeedback+ " has been successfully remove");
    }

    @GetMapping("get-feedback-by-id/{idFeedback}")
    public ResponseEntity<FeedbackDTO> getFeedbackById(@Validated @PathVariable Long idFeedback)
    {
        return this.feedbackService.getById(idFeedback)
                .map(feedbackDTO -> {
                    log.info("Feedback with ID : " +idFeedback+ " has been foun");
                    return new ResponseEntity<>(feedbackDTO, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Feedback with ID : " +idFeedback+ " was not found");
                    throw new RuntimeException(" Unable to retrieve Feedback. Please check the provider ID");
                });
    }


}
