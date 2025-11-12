package fr.kolgna_sec.portfolio_api.media.mappers;

import fr.kolgna_sec.portfolio_api.account.mappers.AccountMapper;
import fr.kolgna_sec.portfolio_api.media.bean.Media;
import fr.kolgna_sec.portfolio_api.media.dto.MediaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", uses = {AccountMapper.class}, unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface MediaMapper {

    @Mapping(target = "accountId", source = "account.idAccount")
    MediaDTO fromMedia(Media media);

    @Mapping(target = "account.idAccount", source = "accountId")
    Media fromMediaDTO(MediaDTO mediaDTO);
}
