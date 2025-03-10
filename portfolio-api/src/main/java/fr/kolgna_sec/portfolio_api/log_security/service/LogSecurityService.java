package fr.kolgna_sec.portfolio_api.log_security.service;

import fr.kolgna_sec.portfolio_api.log_security.bean.LogSecurity;
import fr.kolgna_sec.portfolio_api.log_security.dto.LogSecurityDTO;
import fr.kolgna_sec.portfolio_api.log_security.mappers.LogSecurityMapper;
import fr.kolgna_sec.portfolio_api.log_security.repositories.LogSecurityRepository;
import fr.kolgna_sec.portfolio_api.webservices.Webservices;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LogSecurityService implements Webservices<LogSecurityDTO> {

    private final LogSecurityRepository logSecurityRepository;

    private final LogSecurityMapper logSecurityMapper;

    @Override
    public Page<LogSecurityDTO> all(Pageable pageable) {
        return this.logSecurityRepository.findAll(pageable)
                .map(this.logSecurityMapper::fromLogSecurity);
    }

    @Override
    public LogSecurityDTO add(LogSecurityDTO e) {
        return null;
    }

    @Override
    public LogSecurityDTO update(Long id, LogSecurityDTO e) {
        return null;
    }

    @Override
    public void remove(Long id) {

        Optional<LogSecurity> logSecurity = this.logSecurityRepository.findById(id);

        if (logSecurity.isEmpty())
            throw new RuntimeException("Unable to retrieve log security. Please check to provider id");

        this.logSecurityRepository.delete(logSecurity.get());

    }

    @Override
    public Optional<LogSecurityDTO> getById(Long id) {
        return this.logSecurityRepository.findById(id)
                .map(this.logSecurityMapper::fromLogSecurity);
    }

    @Transactional
    public void removeLogSecurityIdRange(Long startId, Long endId)
    {
        this.logSecurityRepository.deleteByIdRange(startId, endId);
    }

    @Transactional
    public void removeLogSecurityByChooseId(List<Long> listIdPickup)
    {
        this.logSecurityRepository.deleteByIds(listIdPickup);
    }
}
