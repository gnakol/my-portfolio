package fr.kolgna_sec.portfolio_api.token.repositories;

import fr.kolgna_sec.portfolio_api.token.bean.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByValueToken(String token);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.idToken BETWEEN :startId AND :endId")
    void deleteByIdRange(@Param("startId") Long startId, @Param("endId") Long endId);

    // delete by choose id

    @Modifying
    @Query("DELETE FROM Token t WHERE t.idToken IN :ids")
    void deleteByIds(@Param("ids") List<Long> ids);
}
