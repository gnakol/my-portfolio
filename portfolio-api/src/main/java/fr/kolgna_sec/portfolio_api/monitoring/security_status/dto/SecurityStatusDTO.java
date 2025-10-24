package fr.kolgna_sec.portfolio_api.monitoring.security_status.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SecurityStatusDTO {

    private Long id;

    private String kind;
    private String target;
    private Instant checkedAt;
    private Integer daysLeft;
    private Boolean ok;
    private String message;
}
