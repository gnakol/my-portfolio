-- Migration Keycloak : Ajout de la colonne keycloak_user_id
-- Date: 2025-11-22
-- Description: Ajoute la colonne keycloak_user_id pour lier les accounts en DB avec Keycloak

ALTER TABLE account
    ADD COLUMN keycloak_user_id VARCHAR(255) NULL UNIQUE COMMENT 'UUID de l''utilisateur dans Keycloak';

-- Note : La colonne est NULL au début, elle sera remplie lors de la migration des utilisateurs
-- via l'endpoint POST /admin/keycloak-migration/migrate-user
