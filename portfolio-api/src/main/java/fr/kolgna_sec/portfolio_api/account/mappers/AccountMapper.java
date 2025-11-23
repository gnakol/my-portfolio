package fr.kolgna_sec.portfolio_api.account.mappers;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.dto.AccountDTO;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * Mapper Account - Conversion Entity ↔ DTO
 *
 * IMPORTANT : Après migration Keycloak, les rôles ne sont plus mappés
 * (ils sont gérés par Keycloak, pas en DB)
 */
@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AccountMapper {

    AccountDTO fromAccount(Account account);

    Account fromAccountDTO(AccountDTO accountDTO);
}
