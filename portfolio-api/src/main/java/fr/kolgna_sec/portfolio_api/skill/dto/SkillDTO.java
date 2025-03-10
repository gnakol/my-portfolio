package fr.kolgna_sec.portfolio_api.skill.dto;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.skill_categori.bean.SkillCategory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillDTO {

    private Long idSkill;

    private String refSkill;

    private String name;

    private String description;

    private Long levelSkill;

    private Long skillCategory_id;

    private Long account_id;
}
