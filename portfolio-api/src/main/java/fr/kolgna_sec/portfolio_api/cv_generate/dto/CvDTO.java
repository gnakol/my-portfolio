package fr.kolgna_sec.portfolio_api.cv_generate.dto;

import fr.kolgna_sec.portfolio_api.experience.dto.ExperienceDTO;
import fr.kolgna_sec.portfolio_api.hobbies.dto.HobbiesDTO;
import fr.kolgna_sec.portfolio_api.language.dto.LanguageDTO;
import fr.kolgna_sec.portfolio_api.skill.dto.SkillDTO;
import fr.kolgna_sec.portfolio_api.training.dto.TrainingDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CvDTO {

    private String name;

    private String email;

    private String linkedinUrl;

    private String githubUrl;

    private String address;

    private List<ExperienceDTO> experiences;
    private List<TrainingDTO> trainings;
    private List<SkillDTO> skills;
    private List<HobbiesDTO> hobbies;
    private List<LanguageDTO> languages;
}
