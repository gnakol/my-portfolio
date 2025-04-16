package fr.kolgna_sec.portfolio_api.project.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.project_type.bean.ProjectType;
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
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_project")
    private Long idProject;

    @Column(name = "ref_project")
    private String refProject;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "skills_development")
    private String skillsDevelopment;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnoreProperties({"projects"})
    @JoinColumn(name = "id_project_type", nullable = true)
    private ProjectType projectType;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnoreProperties({"projects", "trainings", "skills"})
    @JoinColumn(name = "id_account", nullable = true)
    private Account account;

}
