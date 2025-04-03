package fr.kolgna_sec.portfolio_api.role.repositories;

import fr.kolgna_sec.portfolio_api.role.bean.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String role);
}
