-- ========================================
-- Migration V003: TLS Security Scans Table
-- Scan de sécurité SSL/TLS avancé
-- ========================================

CREATE TABLE IF NOT EXISTS tls_security_scans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    target VARCHAR(255) NOT NULL,
    scanned_at TIMESTAMP NOT NULL,

    -- Informations certificat
    certificate_subject VARCHAR(500),
    certificate_issuer VARCHAR(500),
    certificate_not_before TIMESTAMP,
    certificate_not_after TIMESTAMP,
    days_until_expiry INT,
    signature_algorithm VARCHAR(100),

    -- Versions TLS supportées
    supports_tls10 BOOLEAN DEFAULT FALSE,
    supports_tls11 BOOLEAN DEFAULT FALSE,
    supports_tls12 BOOLEAN DEFAULT FALSE,
    supports_tls13 BOOLEAN DEFAULT FALSE,

    -- Cipher suites
    supported_ciphers TEXT,
    has_weak_ciphers BOOLEAN DEFAULT FALSE,
    has_strong_ciphers BOOLEAN DEFAULT FALSE,

    -- Vulnérabilités
    vulnerable_to_poodle BOOLEAN DEFAULT FALSE,
    vulnerable_to_beast BOOLEAN DEFAULT FALSE,
    vulnerable_to_heartbleed BOOLEAN DEFAULT FALSE,
    vulnerable_to_crime BOOLEAN DEFAULT FALSE,

    -- Configuration serveur
    supports_hsts BOOLEAN DEFAULT FALSE,
    supports_ocsp_stapling BOOLEAN DEFAULT FALSE,
    supports_pfs BOOLEAN DEFAULT FALSE,

    -- Chaîne de certificats
    chain_length INT,
    chain_trusted BOOLEAN DEFAULT FALSE,
    has_intermediate_certs BOOLEAN DEFAULT FALSE,

    -- Score et résumé
    security_grade VARCHAR(10),
    security_score INT,
    warnings VARCHAR(1000),
    recommendations VARCHAR(1000),
    passed BOOLEAN DEFAULT FALSE,

    INDEX idx_target (target),
    INDEX idx_scanned_at (scanned_at DESC),
    INDEX idx_security_grade (security_grade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
