package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.service;

import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.AttackEvent;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.bean.FirewallSession;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.AttackType;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.Protocol;
import fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration.Severity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class ThreatIntelService {

    private final Random random = new Random();

    // Pool d'IPs malveillantes réalistes (Tor exit nodes, botnets connus, etc.)
    private static final String[] MALICIOUS_IPS = {
            "185.220.101.45", "185.220.102.8", "45.141.215.72",  // Tor nodes
            "91.219.236.197", "92.118.160.7", "194.26.192.64",   // Russian botnets
            "103.248.70.64", "103.195.236.17", "112.78.1.45",    // Chinese APT
            "45.142.212.61", "193.32.162.83", "87.120.37.155",   // DDoS sources
            "198.96.155.3", "107.189.10.143", "167.88.61.67"     // Known bad actors
    };

    private static final String[] COUNTRY_CODES = {
            "RU", "CN", "KP", "IR", "BY", "UA", "NL", "US"
    };

    /**
     * Génère un scénario d'attaque initial avec 3-5 attaques simultanées
     */
    public List<AttackEvent> generateInitialAttackWave(FirewallSession session) {
        List<AttackEvent> attacks = new ArrayList<>();

        // Génère entre 3 et 5 attaques différentes
        int attackCount = 3 + random.nextInt(3);
        List<AttackType> selectedTypes = getRandomAttackTypes(attackCount);

        for (AttackType type : selectedTypes) {
            attacks.add(createAttackEvent(session, type));
        }

        log.info("🚨 Generated {} initial attacks for session {}", attacks.size(), session.getSessionUuid());
        return attacks;
    }

    /**
     * Génère une attaque aléatoire pendant le jeu
     */
    public AttackEvent generateRandomAttack(FirewallSession session) {
        AttackType randomType = AttackType.values()[random.nextInt(AttackType.values().length)];
        return createAttackEvent(session, randomType);
    }

    /**
     * Crée un événement d'attaque réaliste
     */
    private AttackEvent createAttackEvent(FirewallSession session, AttackType type) {
        String sourceIp = MALICIOUS_IPS[random.nextInt(MALICIOUS_IPS.length)];
        String country = COUNTRY_CODES[random.nextInt(COUNTRY_CODES.length)];

        // Calcul de la sévérité basée sur le taux de requêtes
        Severity severity = calculateSeverity(type.getRequestsPerSecond());

        return AttackEvent.builder()
                .session(session)
                .attackType(type)
                .sourceIp(sourceIp)
                .sourceCountry(country)
                .targetPort(type.getDefaultPort())
                .protocol(Protocol.valueOf(type.getProtocol()))
                .requestsPerSecond(type.getRequestsPerSecond() + random.nextInt(10000))
                .packetSize(512 + random.nextInt(2048))
                .severity(severity)
                .isBlocked(false)
                .build();
    }

    /**
     * Sélectionne N types d'attaques différents aléatoirement
     */
    private List<AttackType> getRandomAttackTypes(int count) {
        List<AttackType> allTypes = List.of(AttackType.values());
        List<AttackType> selected = new ArrayList<>();

        List<AttackType> shuffled = new ArrayList<>(allTypes);
        java.util.Collections.shuffle(shuffled);

        for (int i = 0; i < Math.min(count, shuffled.size()); i++) {
            selected.add(shuffled.get(i));
        }

        return selected;
    }

    /**
     * Calcule la sévérité en fonction du taux d'attaque
     */
    private Severity calculateSeverity(int requestsPerSecond) {
        if (requestsPerSecond >= 70000) return Severity.CRITICAL;
        if (requestsPerSecond >= 50000) return Severity.HIGH;
        if (requestsPerSecond >= 30000) return Severity.MEDIUM;
        return Severity.LOW;
    }

    /**
     * Génère un scénario textuel pour l'intro
     */
    public String generateScenarioText() {
        return """
                🚨 ALERTE SOC - NIVEAU CRITIQUE 🚨

                Vous êtes analyste SOC senior chez TechShop, leader français de l'e-commerce.
                Date: Black Friday - 14h27 CET

                Votre SIEM vient de déclencher une alerte prioritaire :
                - Trafic anormal détecté : 45 000 req/s (normale: 2 000 req/s)
                - Origine: Multiple IPs suspectes (RU, CN, TOR exit nodes)
                - Cibles: Infrastructure web, DB et Active Directory

                OBJECTIF:
                Vous avez 60 secondes pour identifier les attaques et configurer les règles
                firewall avant que l'infrastructure soit compromise.

                Chaque seconde perdue = 5 000€ de CA en moins.

                Commandes disponibles:
                - block ip <IP>
                - block proto=<tcp/udp> port=<PORT>
                - rate-limit http <RATE>/s
                - drop proto=<PROTOCOL> port=<PORT> size><SIZE>
                - show attacks
                - show threat-intel

                Tapez 'show attacks' pour commencer l'analyse...
                """;
    }
}
