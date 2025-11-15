package fr.kolgna_sec.portfolio_api.monitoring.security_status.bean;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

/**
 * Scan de sécurité SSL/TLS avancé
 * Fonctionnalités que Grafana/Prometheus ne peuvent PAS faire
 */
@Entity
@Table(name = "tls_security_scans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TlsSecurityScan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String target; // ex: kolie-portfolio.org:443

    private Instant scannedAt;

    // ========== INFORMATIONS CERTIFICAT ==========
    private String certificateSubject;
    private String certificateIssuer;
    private Instant certificateNotBefore;
    private Instant certificateNotAfter;
    private Integer daysUntilExpiry;
    private String signatureAlgorithm;

    // ========== VERSIONS TLS SUPPORTÉES ==========
    private Boolean supportsTls10; // ❌ Obsolète (vulnérable)
    private Boolean supportsTls11; // ❌ Obsolète (vulnérable)
    private Boolean supportsTls12; // ✅ OK
    private Boolean supportsTls13; // ✅ Excellent

    // ========== CIPHER SUITES ==========
    @Column(length = 2000)
    private String supportedCiphers; // Liste des cipher suites (séparés par virgule)
    private Boolean hasWeakCiphers;  // Présence de ciphers faibles (RC4, DES, etc.)
    private Boolean hasStrongCiphers; // Présence de ciphers modernes (AES-GCM, ChaCha20)

    // ========== VULNÉRABILITÉS ==========
    private Boolean vulnerableToPoodle;    // SSLv3 POODLE
    private Boolean vulnerableToBeast;     // CBC cipher vulnerability
    private Boolean vulnerableToHeartbleed; // OpenSSL Heartbleed
    private Boolean vulnerableToCrime;     // TLS compression

    // ========== CONFIGURATION SERVEUR ==========
    private Boolean supportsHsts;          // HTTP Strict Transport Security
    private Boolean supportsOcspStapling;  // OCSP Stapling
    private Boolean supportsPfs;           // Perfect Forward Secrecy

    // ========== CHAÎNE DE CERTIFICATS ==========
    private Integer chainLength;           // Nombre de certificats dans la chaîne
    private Boolean chainTrusted;          // Chaîne complète et valide
    private Boolean hasIntermediateCerts;  // Certificats intermédiaires présents

    // ========== SCORE ET RÉSUMÉ ==========
    private String securityGrade;  // A+, A, B, C, D, F
    private Integer securityScore; // 0-100

    @Column(length = 1000)
    private String warnings;       // Avertissements de sécurité

    @Column(length = 1000)
    private String recommendations; // Recommandations

    private Boolean passed;        // true si grade >= B
}
