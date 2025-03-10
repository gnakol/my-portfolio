package fr.kolgna_sec.portfolio_api.feedback.bean;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "experience_name", nullable = false)
    private String experienceName;

    @Column(name = "feedback_type", nullable = false)
    private String feedbackType;

    @Column(name = "feedback_value", nullable = false)
    private String feedbackValue;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
