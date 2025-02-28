package fr.kolgna_sec.portfolio_api.token.mappers;

import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.token.bean.Token;
import fr.kolgna_sec.portfolio_api.token.dto.TokenDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {AccountMapper.class}, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface TokenMapper {

    @Mapping(target = "accountId", source = "account.idAccount")
    TokenDTO fromToken(Token token);

    @Mapping(target = "account.idAccount", source = "accountId")
    Token fromTokenDTO(TokenDTO tokenDTO);
}
