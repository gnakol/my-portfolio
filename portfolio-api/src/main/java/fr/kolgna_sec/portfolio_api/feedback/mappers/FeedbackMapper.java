package fr.kolgna_sec.portfolio_api.feedback.mappers;

import fr.kolgna_sec.portfolio_api.feedback.bean.Feedback;
import fr.kolgna_sec.portfolio_api.feedback.dto.FeedbackDTO;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface FeedbackMapper {

    FeedbackDTO fromFeedback(Feedback feedback);

    Feedback fromFeedbackDTO(FeedbackDTO feedbackDTO);
}
