package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

/**
 * Service pour interroger Prometheus et récupérer les métriques Kubernetes
 */
@Service
@Slf4j
public class PrometheusMetricsService {

    private final String prometheusUrl;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public PrometheusMetricsService(
            @Value("${prometheus.url:http://localhost:9090}") String prometheusUrl,
            ObjectMapper objectMapper
    ) {
        this.prometheusUrl = prometheusUrl;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Compte le nombre de pods actifs dans le namespace portfolio
     */
    public int getPodsCount() {
        long timestamp = System.currentTimeMillis() / 1000; // timestamp en secondes
        String query = "count(kube_pod_info{namespace=\"portfolio\",pod=~\"portfolio.*|mysql.*|nginx.*\"})";
        return executeQuery(query, timestamp)
                .map(value -> (int) Math.round(value))
                .orElse(0);
    }

    /**
     * Récupère la RAM totale consommée par les pods (en bytes)
     */
    public long getTotalPodsRamBytes() {
        long timestamp = System.currentTimeMillis() / 1000; // timestamp en secondes
        String query = "sum(container_memory_working_set_bytes{namespace=\"portfolio\",container!=\"\",container!=\"POD\"})";
        return executeQuery(query, timestamp)
                .map(Math::round)
                .orElse(0L);
    }

    /**
     * Exécute une query PromQL et retourne le résultat scalaire
     */
    private Optional<Double> executeQuery(String query, long timestamp) {
        try {
            log.info("🔍 Querying Prometheus: {} at timestamp {}", query, timestamp);

            // Construction manuelle de l'URL avec encodage correct pour PromQL
            String encodedQuery = java.net.URLEncoder.encode(query, java.nio.charset.StandardCharsets.UTF_8)
                    .replace("+", "%20");  // Remplace + par %20 pour les espaces

            String url = prometheusUrl + "/api/v1/query?query=" + encodedQuery + "&time=" + timestamp;

            log.info("📡 URL construite: {}", url);

            String response = restTemplate.getForObject(url, String.class);

            if (response == null) {
                log.warn("❌ Prometheus query returned null for: {}", query);
                return Optional.empty();
            }

            log.info("📄 Prometheus response: {}", response);

            // Parse JSON response
            JsonNode root = objectMapper.readTree(response);
            JsonNode result = root.path("data").path("result");

            if (result.isArray() && result.size() > 0) {
                String valueStr = result.get(0).path("value").get(1).asText();
                double value = Double.parseDouble(valueStr);
                log.info("✅ Parsed value: {}", value);
                return Optional.of(value);
            }

            log.warn("⚠️ No result from Prometheus for query: {}", query);
            return Optional.empty();

        } catch (Exception e) {
            log.error("❌ Error querying Prometheus: query={}, error={}", query, e.getMessage(), e);
            return Optional.empty();
        }
    }
}