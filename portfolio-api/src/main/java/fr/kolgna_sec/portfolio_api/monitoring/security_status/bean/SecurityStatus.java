package fr.kolgna_sec.portfolio_api.monitoring.security_status.bean;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "security_status")
public class SecurityStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "kind")
    private String kind;
    @Column(name = "target")
    private String target;
    @Column(name = "checked_at")
    private Instant checkedAt;
    @Column(name = "days_left")
    private Integer daysLeft;
    @Column(name = "ok")
    private Boolean ok;
    @Column(name = "message")
    private String message;
}
