package fr.kolgna_sec.portfolio_api.contact.service;

import fr.kolgna_sec.portfolio_api.contact.bean.Contact;
import fr.kolgna_sec.portfolio_api.contact.dto.ContactDTO;
import fr.kolgna_sec.portfolio_api.contact.mappers.ContactMapper;
import fr.kolgna_sec.portfolio_api.contact.repositories.ContactRepository;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactService implements Webservices<ContactDTO> {

    private final ContactRepository contactRepository;

    private final ContactMapper contactMapper;

    @Override
    public Page<ContactDTO> all(Pageable pageable) {
        return this.contactRepository.findAll(pageable)
                .map(this.contactMapper::fromContact);
    }

    @Override
    public ContactDTO add(ContactDTO e) {
        return this.contactMapper.fromContact(this.contactRepository.save(this.contactMapper.fromContactDTO(e)));
    }

    @Override
    public ContactDTO update(Long id, ContactDTO e) {
        return this.contactRepository.findById(id)
                .map(existingContact -> {
                    Optional.ofNullable(e.getEmail()).ifPresent(existingContact::setEmail);
                    Optional.ofNullable(e.getTelephone()).ifPresent(existingContact::setTelephone);
                    Optional.ofNullable(e.getMessage()).ifPresent(existingContact::setMessage);

                    return this.contactMapper.fromContact(this.contactRepository.save(existingContact));
                })
                .orElseThrow(() -> new RuntimeException("Contact with ID : " +id+ " was not found"));
    }

    @Override
    public void remove(Long id) {

        Optional<Contact> contact = this.contactRepository.findById(id);

        if (contact.isEmpty())
            throw new RuntimeException("Contact with ID : " +id+ " was not found");

        this.contactRepository.delete(contact.get());

    }

    @Override
    public Optional<ContactDTO> getById(Long id) {
        return this.contactRepository.findById(id)
                .map(this.contactMapper::fromContact);
    }
}
