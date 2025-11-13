package fr.kolgna_sec.portfolio_api.visit.service;

import fr.kolgna_sec.portfolio_api.visit.bean.Visit;
import fr.kolgna_sec.portfolio_api.visit.dto.CreateVisitRequest;
import fr.kolgna_sec.portfolio_api.visit.dto.VisitDTO;
import fr.kolgna_sec.portfolio_api.visit.dto.VisitStatsDTO;
import fr.kolgna_sec.portfolio_api.visit.mappers.VisitMapper;
import fr.kolgna_sec.portfolio_api.visit.repositories.VisitRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitService {

    private final VisitRepository visitRepository;
    private final VisitMapper visitMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Enregistre une nouvelle visite avec parsing User-Agent + hash IP + géolocalisation
     */
    @Transactional
    public VisitDTO createVisit(CreateVisitRequest request, HttpServletRequest httpRequest) {
        Visit visit = new Visit();

        // Infos basiques
        visit.setPageUrl(request.getPageUrl());
        visit.setReferrer(request.getReferrer());
        visit.setSessionDuration(request.getSessionDuration() != null ? request.getSessionDuration() : 0);
        visit.setVisitDate(LocalDateTime.now());

        // User-Agent
        String userAgent = httpRequest.getHeader("User-Agent");
        visit.setUserAgent(userAgent);

        // Parsing User-Agent
        parseUserAgent(userAgent, visit);

        // Hash IP (GDPR compliant)
        String clientIp = getClientIp(httpRequest);
        visit.setIpHash(hashIp(clientIp));

        // Géolocalisation depuis IP
        String country = getCountryFromIp(clientIp);
        visit.setCountry(country);

        Visit saved = visitRepository.save(visit);
        log.info("✅ Visite enregistrée: page={}, country={}, device={}",
                visit.getPageUrl(), visit.getCountry(), visit.getDeviceType());

        return visitMapper.toDTO(saved);
    }

    /**
     * Met à jour la durée de session (heartbeat)
     */
    @Transactional
    public VisitDTO updateSessionDuration(Long visitId, Integer sessionDuration) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found: " + visitId));

        visit.setSessionDuration(sessionDuration);
        Visit updated = visitRepository.save(visit);

        log.info("⏱️ Session duration mise à jour: visitId={}, duration={}s", visitId, sessionDuration);
        return visitMapper.toDTO(updated);
    }

    /**
     * Récupère les statistiques pour le cockpit admin
     */
    @Transactional(readOnly = true)
    public VisitStatsDTO getStats() {
        VisitStatsDTO stats = new VisitStatsDTO();

        // Total visites
        stats.setTotalVisits(visitRepository.countTotalVisits());

        // Durée moyenne de session
        stats.setAverageSessionDuration(visitRepository.calculateAverageSessionDuration());

        // Visites par pays
        List<Object[]> countryData = visitRepository.countVisitsByCountry();
        stats.setVisitsByCountry(convertToMapList(countryData, "country", "count"));

        // Visites par page
        List<Object[]> pageData = visitRepository.countVisitsByPage();
        stats.setVisitsByPage(convertToMapList(pageData, "page", "count"));

        // Visites par device
        List<Object[]> deviceData = visitRepository.countVisitsByDeviceType();
        stats.setVisitsByDevice(convertToMapList(deviceData, "device", "count"));

        // Visites par browser
        List<Object[]> browserData = visitRepository.countVisitsByBrowser();
        stats.setVisitsByBrowser(convertToMapList(browserData, "browser", "count"));

        // Top referrers
        List<Object[]> referrerData = visitRepository.findTopReferrers();
        stats.setTopReferrers(convertToMapList(referrerData, "referrer", "count"));

        // Visites récentes (dernières 24h)
        LocalDateTime since = LocalDateTime.now().minusDays(1);
        List<Visit> recentVisits = visitRepository.findRecentVisits(since);
        stats.setRecentVisits(recentVisits.stream()
                .map(visitMapper::toDTO)
                .collect(Collectors.toList()));

        return stats;
    }

    /**
     * Récupère toutes les visites (pour export ou filtrage avancé)
     */
    @Transactional(readOnly = true)
    public List<VisitDTO> getAllVisits() {
        return visitRepository.findAll().stream()
                .map(visitMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== NOUVELLES MÉTHODES DE GESTION (DELETE) ==========

    /**
     * Supprime une visite par son ID
     */
    @Transactional
    public void deleteVisit(Long visitId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found: " + visitId));

        visitRepository.delete(visit);
        log.info("🗑️ Visite supprimée: id={}", visitId);
    }

    /**
     * Supprime plusieurs visites en batch
     */
    @Transactional
    public void deleteVisitsInBatch(List<Long> visitIds) {
        if (visitIds == null || visitIds.isEmpty()) {
            log.warn("⚠️ Tentative de suppression batch avec liste vide");
            return;
        }

        List<Visit> visits = visitRepository.findAllById(visitIds);
        visitRepository.deleteAll(visits);
        log.info("🗑️ Suppression batch: {} visites supprimées", visits.size());
    }

    /**
     * Supprime toutes les visites antérieures à X jours
     */
    @Transactional
    public int deleteVisitsOlderThan(int days) {
        if (days < 0) {
            throw new IllegalArgumentException("Le nombre de jours doit être positif");
        }

        LocalDateTime threshold = LocalDateTime.now().minusDays(days);
        List<Visit> oldVisits = visitRepository.findByVisitDateBefore(threshold);

        int count = oldVisits.size();
        visitRepository.deleteAll(oldVisits);

        log.info("🗑️ Purge: {} visites supprimées (> {} jours)", count, days);
        return count;
    }

    /**
     * Récupère l'évolution temporelle des visites (groupées par jour)
     * Format retourné: [{date: "2025-01-01", count: 42}, ...]
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getVisitsTimeline() {
        List<Object[]> timelineData = visitRepository.countVisitsGroupedByDay();
        return convertToMapList(timelineData, "date", "count");
    }

    // ========== MÉTHODES UTILITAIRES ==========

    /**
     * Parse le User-Agent pour extraire device, browser, OS
     */
    private void parseUserAgent(String userAgent, Visit visit) {
        if (userAgent == null || userAgent.isEmpty()) {
            visit.setDeviceType("Unknown");
            visit.setBrowser("Unknown");
            visit.setOperatingSystem("Unknown");
            return;
        }

        String ua = userAgent.toLowerCase();

        // Device Type
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
            visit.setDeviceType("Mobile");
        } else if (ua.contains("tablet") || ua.contains("ipad")) {
            visit.setDeviceType("Tablet");
        } else {
            visit.setDeviceType("Desktop");
        }

        // Browser
        if (ua.contains("edg")) {
            visit.setBrowser("Edge");
        } else if (ua.contains("chrome") && !ua.contains("edg")) {
            visit.setBrowser("Chrome");
        } else if (ua.contains("firefox")) {
            visit.setBrowser("Firefox");
        } else if (ua.contains("safari") && !ua.contains("chrome")) {
            visit.setBrowser("Safari");
        } else if (ua.contains("opera") || ua.contains("opr")) {
            visit.setBrowser("Opera");
        } else {
            visit.setBrowser("Other");
        }

        // Operating System
        if (ua.contains("windows")) {
            visit.setOperatingSystem("Windows");
        } else if (ua.contains("mac")) {
            visit.setOperatingSystem("MacOS");
        } else if (ua.contains("linux")) {
            visit.setOperatingSystem("Linux");
        } else if (ua.contains("android")) {
            visit.setOperatingSystem("Android");
        } else if (ua.contains("iphone") || ua.contains("ipad")) {
            visit.setOperatingSystem("iOS");
        } else {
            visit.setOperatingSystem("Other");
        }
    }

    /**
     * Récupère l'IP réelle du client (gère les proxies/load balancers)
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Si multiple IPs (proxies), prend la première
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    /**
     * Hash SHA-256 de l'IP (GDPR compliant)
     */
    private String hashIp(String ip) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(ip.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            log.error("❌ Erreur hash IP", e);
            return "hash_error";
        }
    }

    /**
     * Géolocalise l'IP via API gratuite (ip-api.com)
     */
    private String getCountryFromIp(String ip) {
        // Skip pour localhost/IPs privées
        if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
            return "Local";
        }

        try {
            String url = "http://ip-api.com/json/" + ip + "?fields=country";
            Map<String, String> response = restTemplate.getForObject(url, Map.class);
            return response != null ? response.getOrDefault("country", "Unknown") : "Unknown";
        } catch (Exception e) {
            log.warn("⚠️ Erreur géolocalisation IP: {}", e.getMessage());
            return "Unknown";
        }
    }

    /**
     * Convertit List<Object[]> en List<Map<String, Object>>
     */
    private List<Map<String, Object>> convertToMapList(List<Object[]> data, String keyName, String valueName) {
        return data.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put(keyName, row[0]);
            map.put(valueName, row[1]);
            return map;
        }).collect(Collectors.toList());
    }
}
