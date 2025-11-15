package fr.kolgna_sec.portfolio_api.monitoring.security_status.service;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.bean.TlsSecurityScan;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.repositories.TlsSecurityScanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.net.ssl.*;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Scanner de sécurité SSL/TLS avancé
 * Analyse complète que Grafana et Prometheus ne peuvent PAS faire
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TlsSecurityScanner {

    private final TlsSecurityScanRepository scanRepository;
    private final TlsMetricsExporter tlsMetricsExporter;

    // Cipher suites faibles (à éviter)
    private static final Set<String> WEAK_CIPHERS = Set.of(
        "RC4", "DES", "3DES", "MD5", "NULL", "EXPORT", "anon"
    );

    // Cipher suites modernes et forts
    private static final Set<String> STRONG_CIPHERS = Set.of(
        "AES_256_GCM", "AES_128_GCM", "CHACHA20", "ECDHE"
    );

    /**
     * Scan complet de sécurité SSL/TLS
     */
    public TlsSecurityScan performSecurityScan(String hostPort) {
        log.info("🔍 Démarrage scan sécurité SSL/TLS pour: {}", hostPort);

        String host = hostPort.split(":")[0];
        int port = hostPort.contains(":") ? Integer.parseInt(hostPort.split(":")[1]) : 443;

        TlsSecurityScan.TlsSecurityScanBuilder scanBuilder = TlsSecurityScan.builder()
                .target(hostPort)
                .scannedAt(Instant.now());

        try {
            // ========== ANALYSE CERTIFICAT ==========
            analyzeCertificate(host, port, scanBuilder);

            // ========== TEST VERSIONS TLS ==========
            testTlsVersions(host, port, scanBuilder);

            // ========== ANALYSE CIPHER SUITES ==========
            analyzeCipherSuites(host, port, scanBuilder);

            // ========== DÉTECTION VULNÉRABILITÉS ==========
            detectVulnerabilities(scanBuilder);

            // ========== CALCUL SCORE ET GRADE ==========
            calculateSecurityScore(scanBuilder);

            TlsSecurityScan scan = scanBuilder.build();
            return scanRepository.save(scan);

        } catch (Exception e) {
            log.error("❌ Erreur scan SSL/TLS pour {}: {}", hostPort, e.getMessage());

            TlsSecurityScan failedScan = scanBuilder
                    .passed(false)
                    .securityGrade("F")
                    .securityScore(0)
                    .warnings("Échec du scan: " + e.getMessage())
                    .build();

            return scanRepository.save(failedScan);
        }
    }

    /**
     * Analyse du certificat SSL
     */
    private void analyzeCertificate(String host, int port, TlsSecurityScan.TlsSecurityScanBuilder builder) throws Exception {
        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(null, null, null);
        SSLSocketFactory factory = ctx.getSocketFactory();

        try (SSLSocket socket = (SSLSocket) factory.createSocket(host, port)) {
            socket.startHandshake();

            Certificate[] chain = socket.getSession().getPeerCertificates();
            X509Certificate cert = (X509Certificate) chain[0];

            // Info certificat
            builder.certificateSubject(cert.getSubjectX500Principal().getName())
                   .certificateIssuer(cert.getIssuerX500Principal().getName())
                   .certificateNotBefore(cert.getNotBefore().toInstant())
                   .certificateNotAfter(cert.getNotAfter().toInstant())
                   .signatureAlgorithm(cert.getSigAlgName());

            // Jours avant expiration
            int daysLeft = (int) Duration.between(Instant.now(), cert.getNotAfter().toInstant()).toDays();
            builder.daysUntilExpiry(daysLeft);

            // Mise à jour de la métrique Prometheus
            tlsMetricsExporter.updateTlsDaysRemaining(daysLeft);

            // Chaîne de certificats
            builder.chainLength(chain.length)
                   .hasIntermediateCerts(chain.length > 1)
                   .chainTrusted(true); // Simplifié (vérification complète nécessiterait TrustManager custom)

            log.info("✅ Certificat analysé: {} jours restants", daysLeft);
        }
    }

    /**
     * Test des versions TLS supportées
     */
    private void testTlsVersions(String host, int port, TlsSecurityScan.TlsSecurityScanBuilder builder) {
        builder.supportsTls10(testTlsVersion(host, port, "TLSv1"))
               .supportsTls11(testTlsVersion(host, port, "TLSv1.1"))
               .supportsTls12(testTlsVersion(host, port, "TLSv1.2"))
               .supportsTls13(testTlsVersion(host, port, "TLSv1.3"));

        log.info("✅ Versions TLS testées");
    }

    private boolean testTlsVersion(String host, int port, String protocol) {
        try {
            SSLContext ctx = SSLContext.getInstance(protocol);
            ctx.init(null, null, null);
            SSLSocketFactory factory = ctx.getSocketFactory();

            try (SSLSocket socket = (SSLSocket) factory.createSocket(host, port)) {
                socket.setEnabledProtocols(new String[]{protocol});
                socket.startHandshake();
                return true;
            }
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Analyse des cipher suites supportées
     */
    private void analyzeCipherSuites(String host, int port, TlsSecurityScan.TlsSecurityScanBuilder builder) throws Exception {
        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(null, null, null);
        SSLSocketFactory factory = ctx.getSocketFactory();

        try (SSLSocket socket = (SSLSocket) factory.createSocket(host, port)) {
            socket.startHandshake();

            String[] ciphers = socket.getSession().getCipherSuite().split(",");
            String cipherList = Arrays.stream(ciphers)
                    .collect(Collectors.joining(", "));

            builder.supportedCiphers(cipherList);

            // Détection ciphers faibles/forts
            boolean hasWeak = Arrays.stream(ciphers)
                    .anyMatch(c -> WEAK_CIPHERS.stream().anyMatch(c::contains));

            boolean hasStrong = Arrays.stream(ciphers)
                    .anyMatch(c -> STRONG_CIPHERS.stream().anyMatch(c::contains));

            builder.hasWeakCiphers(hasWeak)
                   .hasStrongCiphers(hasStrong)
                   .supportsPfs(cipherList.contains("ECDHE") || cipherList.contains("DHE"));

            log.info("✅ Cipher suites analysés");
        }
    }

    /**
     * Détection des vulnérabilités connues
     */
    private void detectVulnerabilities(TlsSecurityScan.TlsSecurityScanBuilder builder) {
        // POODLE: vulnérable si SSLv3 ou TLS 1.0 + CBC
        boolean poodle = Boolean.TRUE.equals(builder.build().getSupportsTls10());

        // BEAST: vulnérable si TLS 1.0 avec CBC ciphers
        boolean beast = Boolean.TRUE.equals(builder.build().getSupportsTls10());

        // CRIME: vulnérable si compression TLS activée (rare aujourd'hui)
        boolean crime = false; // Nécessiterait analyse plus poussée

        // Heartbleed: vulnérable si OpenSSL 1.0.1 - 1.0.1f (nécessiterait version check)
        boolean heartbleed = false;

        builder.vulnerableToPoodle(poodle)
               .vulnerableToBeast(beast)
               .vulnerableToCrime(crime)
               .vulnerableToHeartbleed(heartbleed);

        // HSTS et OCSP (nécessiteraient HTTP headers check - simplifié ici)
        builder.supportsHsts(false) // Nécessite analyse HTTP headers
               .supportsOcspStapling(false);

        log.info("✅ Vulnérabilités détectées");
    }

    /**
     * Calcul du score de sécurité et attribution du grade
     */
    private void calculateSecurityScore(TlsSecurityScan.TlsSecurityScanBuilder builder) {
        TlsSecurityScan scan = builder.build();
        int score = 100;
        List<String> warnings = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        // ========== PÉNALITÉS ==========

        // Versions TLS obsolètes
        if (Boolean.TRUE.equals(scan.getSupportsTls10())) {
            score -= 30;
            warnings.add("⚠️ TLS 1.0 supporté (obsolète et vulnérable)");
            recommendations.add("Désactiver TLS 1.0");
        }
        if (Boolean.TRUE.equals(scan.getSupportsTls11())) {
            score -= 20;
            warnings.add("⚠️ TLS 1.1 supporté (obsolète)");
            recommendations.add("Désactiver TLS 1.1");
        }

        // Cipher suites faibles
        if (Boolean.TRUE.equals(scan.getHasWeakCiphers())) {
            score -= 25;
            warnings.add("⚠️ Cipher suites faibles détectés");
            recommendations.add("Désactiver les ciphers faibles (RC4, DES, 3DES)");
        }

        // Vulnérabilités
        if (Boolean.TRUE.equals(scan.getVulnerableToPoodle())) {
            score -= 20;
            warnings.add("❌ Vulnérable à POODLE");
        }
        if (Boolean.TRUE.equals(scan.getVulnerableToBeast())) {
            score -= 15;
            warnings.add("❌ Vulnérable à BEAST");
        }

        // Expiration certificat
        if (scan.getDaysUntilExpiry() != null && scan.getDaysUntilExpiry() < 30) {
            score -= 10;
            warnings.add("⚠️ Certificat expire dans " + scan.getDaysUntilExpiry() + " jours");
            recommendations.add("Renouveler le certificat SSL");
        }

        // ========== BONUS ==========

        // TLS 1.3 supporté
        if (Boolean.TRUE.equals(scan.getSupportsTls13())) {
            score += 5;
        }

        // Perfect Forward Secrecy
        if (Boolean.TRUE.equals(scan.getSupportsPfs())) {
            score += 5;
        }

        // Strong ciphers
        if (Boolean.TRUE.equals(scan.getHasStrongCiphers())) {
            score += 5;
        }

        // Limiter le score entre 0 et 100
        score = Math.max(0, Math.min(100, score));

        // ========== ATTRIBUTION DU GRADE ==========
        String grade;
        if (score >= 95) grade = "A+";
        else if (score >= 85) grade = "A";
        else if (score >= 75) grade = "B";
        else if (score >= 60) grade = "C";
        else if (score >= 40) grade = "D";
        else grade = "F";

        builder.securityScore(score)
               .securityGrade(grade)
               .passed(score >= 75)
               .warnings(String.join(" | ", warnings))
               .recommendations(String.join(" | ", recommendations));

        log.info("✅ Score calculé: {} (grade: {})", score, grade);
    }

    /**
     * Récupère le dernier scan pour un domaine
     */
    public Optional<TlsSecurityScan> getLatestScan(String target) {
        return scanRepository.findFirstByTargetOrderByScannedAtDesc(target);
    }

    /**
     * Récupère tous les scans
     */
    public List<TlsSecurityScan> getAllScans() {
        return scanRepository.findTop10ByOrderByScannedAtDesc();
    }

    /**
     * Récupère l'historique pour un domaine spécifique
     */
    public List<TlsSecurityScan> getScanHistory(String target) {
        return scanRepository.findByTargetOrderByScannedAtDesc(target);
    }
}
