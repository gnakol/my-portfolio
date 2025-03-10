package fr.kolgna_sec.portfolio_api.log_security.repositories;

import fr.kolgna_sec.portfolio_api.log_security.bean.LogSecurity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogSecurityRepository extends JpaRepository<LogSecurity, Long> {

    @Modifying
    @Query("DELETE FROM LogSecurity l WHERE l.idLog BETWEEN :startId AND :endId")
    void deleteByIdRange(@Param("startId") Long startId, @Param("endId") Long endId);

    // delete by choose id

    @Modifying
    @Query("DELETE FROM LogSecurity l WHERE l.idLog IN :ids")
    void deleteByIds(@Param("ids") List<Long> ids);
}
