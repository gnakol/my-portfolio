package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Optional;

/**
 * Service pour interroger Prometheus et récupérer les métriques Kubernetes
 */
@Service
@Slf4j
public class PrometheusMetricsService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public PrometheusMetricsService(
            @Value("${prometheus.url:http://localhost:9090}") String prometheusUrl,
            ObjectMapper objectMapper
    ) {
        this.webClient = WebClient.builder()
                .baseUrl(prometheusUrl)
                .build();
        this.objectMapper = objectMapper;
    }

    /**
     * Compte le nombre de pods actifs dans le namespace portfolio
     */
    public int getPodsCount() {
        String query = "count(kube_pod_info{namespace=\"portfolio\",pod=~\"portfolio.*|mysql.*|nginx.*\"})";
        return executeQuery(query)
                .map(value -> (int) Math.round(value))
                .orElse(0);
    }

    /**
     * Récupère la RAM totale consommée par les pods (en bytes)
     */
    public long getTotalPodsRamBytes() {
        String query = "sum(container_memory_working_set_bytes{namespace=\"portfolio\",container!=\"\",container!=\"POD\"})";
        return executeQuery(query)
                .map(Math::round)
                .orElse(0L);
    }

    /**
     * Exécute une query PromQL et retourne le résultat scalaire
     */
    private Optional<Double> executeQuery(String query) {
        try {
            // Utilise build(true) pour encoder correctement les caractères spéciaux
            String response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/v1/query")
                            .queryParam("query", query)
                            .build(true))
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (response == null) {
                log.warn("❌ Prometheus query returned null for: {}", query);
                return Optional.empty();
            }

            // Parse JSON response
            JsonNode root = objectMapper.readTree(response);
            JsonNode result = root.path("data").path("result");

            if (result.isArray() && result.size() > 0) {
                String valueStr = result.get(0).path("value").get(1).asText();
                return Optional.of(Double.parseDouble(valueStr));
            }

            log.debug("ℹ️ No result from Prometheus for query: {}", query);
            return Optional.empty();

        } catch (Exception e) {
            log.error("❌ Error querying Prometheus: query={}, error={}", query, e.getMessage());
            return Optional.empty();
        }
    }
}
