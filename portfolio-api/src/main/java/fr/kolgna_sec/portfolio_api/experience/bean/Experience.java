package fr.kolgna_sec.portfolio_api.experience.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.experience_type.bean.ExperienceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "experience")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_experience")
    private Long idExperience;

    @Column(name = "ref_experience")
    private String refExperience;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "company_name")
    private String companyName;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnoreProperties({"experiences"})
    @JoinColumn(name = "id_experience_type", nullable = true)
    private ExperienceType experienceType;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnoreProperties({"experiences", "trainings", "skills"})
    @JoinColumn(name = "id_account", nullable = true)
    private Account account;

    @Column(name = "skills_acquired")
    private String skillsAcquired;
}
