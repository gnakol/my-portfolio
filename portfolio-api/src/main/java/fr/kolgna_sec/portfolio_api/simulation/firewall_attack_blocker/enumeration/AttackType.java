package fr.kolgna_sec.portfolio_api.simulation.firewall_attack_blocker.enumeration;

public enum AttackType {
    DDOS_HTTP("DDoS HTTP Flood", 80, "HTTP", 50000),
    DDOS_SYN("SYN Flood Attack", 443, "TCP", 75000),
    DNS_AMPLIFICATION("DNS Amplification", 53, "UDP", 40000),
    BOTNET("Botnet Attack", 8080, "TCP", 60000),
    BRUTEFORCE_SSH("SSH Brute Force", 22, "TCP", 30000),
    SQL_INJECTION("SQL Injection Attempt", 3306, "TCP", 20000);

    private final String displayName;
    private final int defaultPort;
    private final String protocol;
    private final int requestsPerSecond;

    AttackType(String displayName, int defaultPort, String protocol, int requestsPerSecond) {
        this.displayName = displayName;
        this.defaultPort = defaultPort;
        this.protocol = protocol;
        this.requestsPerSecond = requestsPerSecond;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getDefaultPort() {
        return defaultPort;
    }

    public String getProtocol() {
        return protocol;
    }

    public int getRequestsPerSecond() {
        return requestsPerSecond;
    }
}
