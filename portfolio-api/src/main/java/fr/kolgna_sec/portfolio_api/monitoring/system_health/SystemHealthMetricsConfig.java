package fr.kolgna_sec.portfolio_api.monitoring.system_health;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SystemHealthMetricsConfig {

    private final MeterRegistry registry;
    private final SystemHealthService service;

    @PostConstruct
    void bind() {
        Gauge.builder("mco_system_cpu_load", () -> {
            var s = service.snapshot();
            return s.getSystemCpuLoad() == null ? -1.0 : s.getSystemCpuLoad();
        }).description("System CPU load 0..1").register(registry);

        Gauge.builder("mco_heap_used_bytes", () -> service.snapshot().getHeapUsedBytes())
                .description("Heap used bytes").register(registry);

        Gauge.builder("mco_heap_max_bytes", () -> service.snapshot().getHeapMaxBytes())
                .description("Heap max bytes").register(registry);

        Gauge.builder("mco_disk_total_bytes", () -> service.snapshot().getTotalDiskBytes())
                .description("Total disk bytes (all stores)").register(registry);

        Gauge.builder("mco_disk_free_bytes", () -> service.snapshot().getFreeDiskBytes())
                .description("Free disk bytes (all stores)").register(registry);
    }
}

