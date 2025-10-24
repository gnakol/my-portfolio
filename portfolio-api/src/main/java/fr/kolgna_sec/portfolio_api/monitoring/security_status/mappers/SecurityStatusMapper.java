package fr.kolgna_sec.portfolio_api.monitoring.security_status.mappers;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.bean.SecurityStatus;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.dto.SecurityStatusDTO;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SecurityStatusMapper {

    SecurityStatusDTO fromSecurityStatus(SecurityStatus securityStatus);

    SecurityStatus fromSecurityStatusDTO(SecurityStatusDTO securityStatusDTO);
}
