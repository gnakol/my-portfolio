package fr.kolgna_sec.portfolio_api.log_security.bean;

import fr.kolgna_sec.portfolio_api.log_security.enumeration.LogType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "log_security")
public class LogSecurity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_log")
    private Long idLog;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_log")
    private LogType typeLog;

    @Column(name = "message")
    private String message;

    @Column(name = "date_log", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateLog;

    @Column(name = "ip_source")
    private String ipSource;
}


