package fr.kolgna_sec.portfolio_api.skill.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.skill_categori.bean.SkillCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "skill")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_skill")
    private Long idSkill;

    @Column(name = "ref_skill")
    private String refSkill;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "level")
    private Long levelSkill;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnoreProperties({"skills"})
    @JoinColumn(name = "id_skill_category", nullable = true)
    private SkillCategory skillCategory;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JsonIgnoreProperties({"skills", "trainings"})
    @JoinColumn(name = "id_account", nullable = true)
    private Account account;
}
