package fr.kolgna_sec.portfolio_api.log_security.mappers;

import fr.kolgna_sec.portfolio_api.log_security.bean.LogSecurity;
import fr.kolgna_sec.portfolio_api.log_security.dto.LogSecurityDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LogSecurityMapper {

    LogSecurityDTO fromLogSecurity(LogSecurity logSecurity);

    LogSecurity fromLogSecurityDTO(LogSecurityDTO logSecurityDTO);
}
