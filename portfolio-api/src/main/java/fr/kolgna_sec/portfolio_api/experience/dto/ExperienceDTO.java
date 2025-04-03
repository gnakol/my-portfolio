package fr.kolgna_sec.portfolio_api.experience.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class ExperienceDTO {

    private Long idExperience;

    private String refExperience;

    private String title;

    private String description;

    private Date startDate;

    private Date endDate;

    private String companyName;

    private Long experienceType_id;

    private Long account_id;

    private String skillsAcquired;
}
