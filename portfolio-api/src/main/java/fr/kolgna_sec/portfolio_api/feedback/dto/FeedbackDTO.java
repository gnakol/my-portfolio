package fr.kolgna_sec.portfolio_api.feedback.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDTO {

    private Long id;

    private String experienceName;

    private String feedbackType;

    private String feedbackValue;

    private LocalDateTime createdAt;
}
