-- Migration pour les tables de simulation VLAN
-- À exécuter via Flyway/Liquibase ou manuellement

CREATE TABLE IF NOT EXISTS simulation_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP NULL,
    client_hash VARCHAR(64) NOT NULL,
    user_agent VARCHAR(512) NULL,
    score INT NULL,
    duration_ms BIGINT NULL,
    success BOOLEAN NULL,
    INDEX idx_client_hash (client_hash),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS simulation_command (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    raw_command VARCHAR(512) NOT NULL,
    status VARCHAR(10) NOT NULL,
    step_index INT NULL,
    note VARCHAR(1024) NULL,
    FOREIGN KEY (session_id) REFERENCES simulation_session(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS simulation_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    experience_name VARCHAR(255) NOT NULL,
    feedback_type VARCHAR(100) NOT NULL,
    feedback_value TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (session_id) REFERENCES simulation_session(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
