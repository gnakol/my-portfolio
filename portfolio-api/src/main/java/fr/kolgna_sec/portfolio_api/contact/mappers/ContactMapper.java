package fr.kolgna_sec.portfolio_api.contact.mappers;

import fr.kolgna_sec.portfolio_api.contact.bean.Contact;
import fr.kolgna_sec.portfolio_api.contact.dto.ContactDTO;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface ContactMapper {

    ContactDTO fromContact(Contact contact);

    Contact fromContactDTO(ContactDTO contactDTO);
}
