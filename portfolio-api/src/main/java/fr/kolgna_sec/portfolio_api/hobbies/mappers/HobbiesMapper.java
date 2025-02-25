package fr.kolgna_sec.portfolio_api.hobbies.mappers;

import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.hobbies.bean.Hobbies;
import fr.kolgna_sec.portfolio_api.hobbies.dto.HobbiesDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {AccountMapper.class}, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface HobbiesMapper {

    @Mapping(target = "account_id", source = "account.idAccount")
    HobbiesDTO fromHobbies(Hobbies hobbies);

    @Mapping(target = "account.idAccount", source = "account_id")
    Hobbies fromHobbiesDTO(HobbiesDTO hobbiesDTO);
}
