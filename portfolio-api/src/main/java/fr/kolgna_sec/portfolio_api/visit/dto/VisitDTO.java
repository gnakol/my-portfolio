package fr.kolgna_sec.portfolio_api.visit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VisitDTO {
    private Long idVisit;
    private LocalDateTime visitDate;
    private String userAgent;
    private String referrer;
    private String country;
    private String pageUrl;
    private Integer sessionDuration;
    private String ipHash;
    private String deviceType;
    private String browser;
    private String operatingSystem;
}
