package fr.kolgna_sec.portfolio_api.visit.mappers;

import fr.kolgna_sec.portfolio_api.visit.bean.Visit;
import fr.kolgna_sec.portfolio_api.visit.dto.VisitDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VisitMapper {
    VisitDTO toDTO(Visit visit);
    Visit toEntity(VisitDTO visitDTO);
}
