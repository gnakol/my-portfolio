package fr.kolgna_sec.portfolio_api.contact.repositories;

import fr.kolgna_sec.portfolio_api.contact.bean.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
}
