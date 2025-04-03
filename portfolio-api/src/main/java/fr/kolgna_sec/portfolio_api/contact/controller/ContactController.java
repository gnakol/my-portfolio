package fr.kolgna_sec.portfolio_api.contact.controller;

import fr.kolgna_sec.portfolio_api.contact.dto.ContactDTO;
import fr.kolgna_sec.portfolio_api.contact.service.ContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("contact")
@Slf4j
public class ContactController {

    private final ContactService contactService;

    @GetMapping("/all-contact")
    private ResponseEntity<Page<ContactDTO>> allContact(Pageable pageable)
    {
        return ResponseEntity.ok().body(this.contactService.all(pageable));
    }

    @PostMapping("/add-new-contact")
    public ResponseEntity<ContactDTO> addContact(@Validated @RequestBody ContactDTO contactDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.contactService.add(contactDTO));
    }

    @PutMapping("/update-contact/{idContact}")
    public ResponseEntity<ContactDTO> updateContact(@Validated @PathVariable Long idContact, @RequestBody ContactDTO contactDTO)
    {
        return ResponseEntity.status(202).body(this.contactService.update(idContact, contactDTO));
    }

    @DeleteMapping("/remove-contact/{idContact}")
    public ResponseEntity<String> removeContact(@Validated @PathVariable Long idContact)
    {
        this.contactService.remove(idContact);
        return ResponseEntity.status(202).body("Contact with ID : " +idContact+ " has been successfully removed");
    }

    @GetMapping("/get-contact-by-id/{idContact}")
    public ResponseEntity<ContactDTO> getContactById(@Validated @PathVariable Long idContact)
    {
        return this.contactService.getById(idContact)
                .map(existingContact -> {
                    log.info("Contact with ID : " +idContact+ " has been found");
                    return new ResponseEntity<>(existingContact, HttpStatus.OK);
                })
                .orElseThrow(() -> {
                    log.error("Contact with ID : " +idContact+ " was not found");
                    throw new RuntimeException("Unable to retrieve Contact. Please check the provider ID");
                });
    }
}
