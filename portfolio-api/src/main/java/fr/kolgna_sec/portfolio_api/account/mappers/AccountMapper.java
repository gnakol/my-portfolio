package fr.kolgna_sec.portfolio_api.account.mappers;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import fr.kolgna_sec.portfolio_api.account.dto.AccountDTO;
import fr.kolgna_sec.portfolio_api.role.mappers.RoleMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {RoleMapper.class}, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface AccountMapper {

    @Mapping(target = "roleDTOS", source = "roles")
    AccountDTO fromAccount(Account account);

    @Mapping(target = "roles", source = "roleDTOS")
    Account fromAccountDTO(AccountDTO accountDTO);
}
