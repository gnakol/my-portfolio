package fr.kolgna_sec.portfolio_api.feedback.service;

import fr.kolgna_sec.portfolio_api.feedback.bean.Feedback;
import fr.kolgna_sec.portfolio_api.feedback.dto.FeedbackDTO;
import fr.kolgna_sec.portfolio_api.feedback.mappers.FeedbackMapper;
import fr.kolgna_sec.portfolio_api.feedback.repositories.FeedbackRepository;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeedbackService implements Webservices<FeedbackDTO> {

    private final FeedbackRepository feedbackRepository;

    private final FeedbackMapper feedbackMapper;


    @Override
    public Page<FeedbackDTO> all(Pageable pageable) {
        return this.feedbackRepository.findAll(pageable)
                .map(this.feedbackMapper::fromFeedback);
    }

    @Override
    public FeedbackDTO add(FeedbackDTO e) {
        return this.feedbackMapper.fromFeedback(this.feedbackRepository.save(this.feedbackMapper.fromFeedbackDTO(e)));
    }

    @Override
    public FeedbackDTO update(Long id, FeedbackDTO e) {
        return this.feedbackMapper.fromFeedback(this.feedbackRepository.findById(id)
                .map(feedback -> {
                    if (feedback.getExperienceName() != null)
                        feedback.setExperienceName(e.getExperienceName());
                    if (feedback.getFeedbackType() != null)
                        feedback.setFeedbackType(e.getFeedbackType());
                    if (feedback.getFeedbackValue() != null)
                        feedback.setFeedbackValue(e.getFeedbackValue());
                    if (feedback.getCreatedAt() != null)
                        feedback.setCreatedAt(e.getCreatedAt());

                    return this.feedbackRepository.save(feedback);
                })
                .orElseThrow(() -> new RuntimeException("Unable to retrieve Feedback. Please check the provider ID")));
    }

    @Override
    public void remove(Long id) {

        Optional<Feedback> feedback = this.feedbackRepository.findById(id);

        if (feedback.isEmpty())
            throw new RuntimeException("Unable with ID : " +id+ " was not found");

        this.feedbackRepository.delete(feedback.get());

    }

    @Override
    public Optional<FeedbackDTO> getById(Long id) {
        return this.feedbackRepository.findById(id)
                .map(this.feedbackMapper::fromFeedback);
    }
}
