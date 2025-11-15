package fr.kolgna_sec.portfolio_api.monitoring.security_status.service;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service d'exposition des métriques Prometheus pour TLS
 * Permet à Grafana/Prometheus de scraper les données TLS
 */
@Service
@Slf4j
public class TlsMetricsExporter {

    private final MeterRegistry meterRegistry;
    private final AtomicInteger tlsDaysRemaining = new AtomicInteger(0);

    public TlsMetricsExporter(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        // Création de la gauge Prometheus
        Gauge.builder("portfolio_tls_days_remaining", tlsDaysRemaining, AtomicInteger::get)
                .description("Nombre de jours restants avant expiration du certificat TLS")
                .tag("application", "portfolio")
                .tag("type", "security")
                .register(meterRegistry);

        log.info("✅ Métrique Prometheus créée: portfolio_tls_days_remaining");
    }

    /**
     * Met à jour le nombre de jours restants avant expiration TLS
     * Appelé après chaque scan TLS
     */
    public void updateTlsDaysRemaining(int days) {
        tlsDaysRemaining.set(days);
        log.info("📊 Métrique Prometheus mise à jour: portfolio_tls_days_remaining = {}", days);
    }

    /**
     * Récupère la valeur actuelle
     */
    public int getTlsDaysRemaining() {
        return tlsDaysRemaining.get();
    }
}
