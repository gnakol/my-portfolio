package fr.kolgna_sec.portfolio_api.media.repositories;

import fr.kolgna_sec.portfolio_api.media.bean.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {

    /**
     * Trouve tous les médias d'un compte avec un tag spécifique
     * @param accountId ID du compte
     * @param mediaType Tag du média (lab, schema reseau, demo vlan)
     * @return Liste des médias correspondants
     */
    List<Media> findByAccount_IdAccountAndMediaType(Long accountId, String mediaType);
}
