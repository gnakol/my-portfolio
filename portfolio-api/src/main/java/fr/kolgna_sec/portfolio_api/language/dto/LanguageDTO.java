package fr.kolgna_sec.portfolio_api.language.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LanguageDTO {

    private Long idLanguage;

    private String refLanguage;

    private String name;

    private String proficiencyLevel;

    private Long accountId;
}
