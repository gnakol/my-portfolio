package fr.kolgna_sec.portfolio_api.language.mappers;

import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.language.bean.Language;
import fr.kolgna_sec.portfolio_api.language.dto.LanguageDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {AccountMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LanguageMapper {

    @Mapping(target = "accountId", source = "account.idAccount")
    LanguageDTO fromLanguage(Language language);

    @Mapping(target = "account.idAccount", source = "accountId")
    Language fromLanguageDTO(LanguageDTO languageDTO);
}
