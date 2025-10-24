package fr.kolgna_sec.portfolio_api.monitoring.security_status.service;

import fr.kolgna_sec.portfolio_api.monitoring.security_status.bean.SecurityStatus;
import fr.kolgna_sec.portfolio_api.monitoring.security_status.repositories.SecurityStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TlsCheckService {

    private final SecurityStatusRepository securityStatusRepository;

    @Value("#{'${security.tls.hosts}'.split(',')}")
    private List<String> hosts;

    public SecurityStatus checkOne(String hostPort) {
        String host = hostPort.split(":")[0];
        int port = hostPort.contains(":") ? Integer.parseInt(hostPort.split(":")[1]) : 443;

        try {
            SSLContext ctx = SSLContext.getInstance("TLS");
            ctx.init(null, null, null);
            SSLSocketFactory factory = ctx.getSocketFactory();
            try (SSLSocket socket = (SSLSocket) factory.createSocket(host, port)) {
                socket.startHandshake();
                Certificate[] chain = socket.getSession().getPeerCertificates();
                X509Certificate leaf = (X509Certificate) chain[0];
                Instant notAfter = leaf.getNotAfter().toInstant();
                int daysLeft = (int) Duration.between(Instant.now(), notAfter).toDays();

                boolean ok = daysLeft > 14; // seuil “confort”
                String msg = "Expire le " + notAfter + " (jours restants=" + daysLeft + ")";

                SecurityStatus s = SecurityStatus.builder()
                        .kind("TLS")
                        .target(hostPort)
                        .checkedAt(Instant.now())
                        .daysLeft(daysLeft)
                        .ok(ok)
                        .message(msg)
                        .build();
                return this.securityStatusRepository.save(s);
            }
        } catch (Exception e) {
            SecurityStatus s = SecurityStatus.builder()
                    .kind("TLS")
                    .target(hostPort)
                    .checkedAt(Instant.now())
                    .daysLeft(null)
                    .ok(false)
                    .message("Erreur TLS: " + e.getMessage())
                    .build();
            return this.securityStatusRepository.save(s);
        }
    }

    /** Planificateur: toutes les 30 min (prod). Ajustable. */
    @Scheduled(cron = "0 */30 * * * *")
    public void scheduledCheck() {
        if (hosts == null) return;
        for (String hp : hosts) {
            if (hp == null || hp.isBlank()) continue;
            checkOne(hp.trim());
        }
    }

    public List<SecurityStatus> latestSnapshot() {
        List<SecurityStatus> out = new ArrayList<>();
        out.addAll(this.securityStatusRepository.findTop5ByKindOrderByCheckedAtDesc("TLS"));
        return out;
    }
}
