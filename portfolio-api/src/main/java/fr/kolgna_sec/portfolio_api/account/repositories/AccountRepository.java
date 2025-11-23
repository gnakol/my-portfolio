package fr.kolgna_sec.portfolio_api.account.repositories;

import fr.kolgna_sec.portfolio_api.account.bean.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByEmail(String email);

    Optional<Account> findByKeycloakUserId(String keycloakUserId);
}
