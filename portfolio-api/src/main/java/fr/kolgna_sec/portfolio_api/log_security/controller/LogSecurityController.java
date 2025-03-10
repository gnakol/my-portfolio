package fr.kolgna_sec.portfolio_api.log_security.controller;

import fr.kolgna_sec.portfolio_api.log_security.dto.LogSecurityDTO;
import fr.kolgna_sec.portfolio_api.log_security.service.LogSecurityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("log-security")
public class LogSecurityController {

    private final LogSecurityService logSecurityService;

    @GetMapping("all-log-security")
    public ResponseEntity<Page<LogSecurityDTO>> allLogSecurity(Pageable pageable)
    {
        return ResponseEntity.ok(this.logSecurityService.all(pageable));
    }

    @DeleteMapping("remove-log-security/{idLogSecurity}")
    public ResponseEntity<String> removeLogSecurity(@Validated @PathVariable Long idLogSecurity)
    {
        this.logSecurityService.remove(idLogSecurity);

        return ResponseEntity.status(202).body("Log security with ID : " +idLogSecurity+ " has been successfully remove");
    }

    @DeleteMapping("remove-log-security-range-id/{startId}/{endId}")
    public ResponseEntity<String> removeLogSecurityByIdRange(@Validated @PathVariable Long startId, @PathVariable Long endId)
    {
        this.logSecurityService.removeLogSecurityIdRange(startId, endId);

        return ResponseEntity.status(202).body("Remove by range id log security was successfully");
    }

    @DeleteMapping("remove-log-security-by-choose-id")
    public ResponseEntity<String> removeLogSecurityByChooseId(@Validated @RequestBody List<Long> listIdsPickup)
    {
        this.logSecurityService.removeLogSecurityByChooseId(listIdsPickup);

        return ResponseEntity.status(202).body("Remove pickup by choose id was successfully");
    }
}
