package fr.kolgna_sec.portfolio_api.log_security.dto;

import fr.kolgna_sec.portfolio_api.log_security.enumeration.LogType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LogSecurityDTO {

    private Long idLog;

    private LogType typeLog;

    private String message;

    private LocalDateTime dateLog;

    private String ipSource;
}
