package fr.kolgna_sec.portfolio_api.visit.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "portfolio_visits")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_visit")
    private Long idVisit;

    @Column(name = "visit_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime visitDate;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "referrer", length = 500)
    private String referrer;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "page_url", nullable = false, length = 500)
    private String pageUrl;

    @Column(name = "session_duration")
    private Integer sessionDuration = 0; // en secondes

    @Column(name = "ip_hash", length = 64)
    private String ipHash; // SHA-256 de l'IP

    @Column(name = "device_type", length = 50)
    private String deviceType; // Mobile, Desktop, Tablet

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @PrePersist
    protected void onCreate() {
        if (visitDate == null) {
            visitDate = LocalDateTime.now();
        }
        if (sessionDuration == null) {
            sessionDuration = 0;
        }
    }
}
