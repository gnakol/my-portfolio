# 🔐 GUIDE DE MIGRATION KEYCLOAK

## 📋 État actuel

- ✅ **Keycloak configuré** : Realm `portfolio`, Client `portfolio-api`, Rôle `ADMIN`
- ✅ **Services créés** :
  - `KeycloakAdminService` : Gestion Admin API (création users, assignation rôles)
  - `KeycloakAccountService` : Authentification users
  - `KeycloakUserSyncService` : Synchro auto Keycloak ↔ DB
- ✅ **Migration DB** : Script Flyway `V004__add_keycloak_user_id_to_account.sql`
- ✅ **Refactoring** : `Account` entity et `AccountService` nettoyés

---

## 🚀 ÉTAPE 1 : DÉMARRER LES SERVICES

### 1.1 Démarrer Keycloak

```bash
docker-compose up -d keycloak
```

Vérifier que Keycloak est accessible :
- URL : http://localhost:8082
- Admin : `admin` / `admin`

### 1.2 Démarrer l'API Spring Boot

```bash
cd portfolio-api
./mvnw spring-boot:run
```

⚠️ **IMPORTANT** : La migration Flyway V004 va automatiquement ajouter la colonne `keycloak_user_id` à la table `account`.

---

## 🧪 ÉTAPE 2 : TESTER LA CONNEXION ADMIN KEYCLOAK

Vérifier que l'API peut se connecter à Keycloak en tant qu'admin :

```bash
curl -X GET http://localhost:9000/portfolio-api/admin/keycloak-migration/test-admin-connection
```

✅ **Réponse attendue** :
```json
{
  "status": "success",
  "message": "Connexion Admin Keycloak OK",
  "tokenPreview": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6I..."
}
```

---

## 📦 ÉTAPE 3 : MIGRER L'UTILISATEUR ADMIN EXISTANT

### 3.1 Vérifier l'utilisateur en DB

```bash
mysql -u kol_sec_admin -p portfolio_db -e "SELECT email, name, first_name FROM account WHERE email = 'support-admin@portfolio.fr';"
```

### 3.2 Migrer l'utilisateur vers Keycloak

```bash
curl -X POST http://localhost:9000/portfolio-api/admin/keycloak-migration/migrate-user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "support-admin@portfolio.fr",
    "password": "AdminPortfolio2025!",
    "isAdmin": "true"
  }'
```

✅ **Réponse attendue** :
```json
{
  "message": "Utilisateur migré avec succès",
  "email": "support-admin@portfolio.fr",
  "keycloakUserId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "roleAssigned": "ADMIN"
}
```

### 3.3 Vérifier dans Keycloak

1. Aller sur http://localhost:8082/admin/master/console/#/portfolio/users
2. Chercher `support-admin@portfolio.fr`
3. Vérifier que le rôle `ADMIN` est assigné

### 3.4 Vérifier en DB

```bash
mysql -u kol_sec_admin -p portfolio_db -e "SELECT email, keycloak_user_id FROM account WHERE email = 'support-admin@portfolio.fr';"
```

Le champ `keycloak_user_id` doit maintenant contenir l'UUID Keycloak.

---

## 🔑 ÉTAPE 4 : TESTER LA CONNEXION VIA KEYCLOAK

### 4.1 Se connecter avec l'utilisateur migré

```bash
curl -X POST http://localhost:9000/portfolio-api/connexion \
  -H "Content-Type: application/json" \
  -d '{
    "email": "support-admin@portfolio.fr",
    "password": "AdminPortfolio2025!"
  }'
```

✅ **Réponse attendue** :
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6I..."
}
```

❌ **Si erreur 401** :
```json
{
  "error": "Identifiants invalides"
}
```
→ Vérifier que le mot de passe est correct dans Keycloak.

❌ **Si erreur 403** :
```json
{
  "error": "Accès réservé à l'administrateur"
}
```
→ Vérifier que le rôle `ADMIN` est bien assigné dans Keycloak.

### 4.2 Décoder le JWT pour vérifier les rôles

Aller sur https://jwt.io et coller le token.

Vérifier la section `realm_access` :
```json
{
  "realm_access": {
    "roles": [
      "ADMIN",
      "default-roles-portfolio",
      "offline_access",
      "uma_authorization"
    ]
  }
}
```

---

## 🧹 ÉTAPE 5 : NETTOYER L'ANCIENNE AUTHENTIFICATION (Optionnel)

Une fois la migration confirmée, tu peux :

### 5.1 Supprimer les colonnes obsolètes en DB

**⚠️ À FAIRE APRÈS AVOIR CONFIRMÉ QUE TOUT FONCTIONNE !**

```sql
ALTER TABLE account DROP COLUMN password;
```

### 5.2 Supprimer les tables `role` et `role_account`

**⚠️ À FAIRE APRÈS AVOIR CONFIRMÉ QUE TOUT FONCTIONNE !**

```sql
DROP TABLE role_account;
DROP TABLE role;
DROP TABLE role_permission;
DROP TABLE permission;
```

### 5.3 Supprimer le controller de migration

Supprimer le fichier `KeycloakMigrationController.java` (utilisé uniquement pour la migration).

---

## 📝 POINTS D'ATTENTION

### 1. Gestion des rôles

- ✅ Les rôles sont gérés dans Keycloak (Realm roles)
- ✅ `AuthController.java` vérifie le rôle `ADMIN` dans le JWT
- ❌ Plus de gestion de rôles en DB

### 2. Changement de mot de passe

- ❌ Plus de `changePassword()` dans `AccountService`
- ✅ Les utilisateurs doivent réinitialiser leur MDP via Keycloak :
  - URL : http://localhost:8082/realms/portfolio/account/
  - Ou via l'Admin Console

### 3. Création de nouveaux utilisateurs

**Option 1 : Via Keycloak (recommandé)**
1. Créer le user dans Keycloak
2. L'API créera automatiquement l'account en DB à la 1ère connexion (via `KeycloakUserSyncService`)

**Option 2 : Via endpoint dédié (à créer)**
```java
@PostMapping("admin/create-user")
public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
    // 1. Créer dans Keycloak
    String keycloakUserId = keycloakAdminService.createUser(...);

    // 2. Créer en DB
    Account account = new Account();
    account.setKeycloakUserId(keycloakUserId);
    account.setEmail(request.getEmail());
    // ...
    accountRepository.save(account);
}
```

---

## 🔧 DÉPANNAGE

### Erreur : "Keycloak server is not reachable"

```bash
# Vérifier que Keycloak est démarré
docker ps | grep keycloak

# Vérifier les logs Keycloak
docker logs portfolio-keycloak
```

### Erreur : "Unable to retrieve Role. Please check the provide ID"

→ La colonne `keycloak_user_id` n'existe pas encore.
→ Relancer l'API pour exécuter la migration Flyway V004.

### Erreur : "Role ADMIN not found"

→ Le rôle `ADMIN` n'existe pas dans Keycloak.
→ Créer le rôle manuellement :
1. Keycloak Admin Console
2. Realm `portfolio` → Realm roles
3. Create role : `ADMIN`

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ Migrer l'admin existant
2. ✅ Tester la connexion
3. ⏳ Migrer les endpoints suivants :
   - `POST /refresh-token`
   - `POST /disconnect`
4. ⏳ Adapter la sécurité Spring Boot pour valider les JWT Keycloak
5. ⏳ Supprimer les anciennes tables/colonnes une fois tout validé

---

## 📚 RESSOURCES

- [Keycloak Admin REST API](https://www.keycloak.org/docs-api/latest/rest-api/index.html)
- [Spring Security OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- [Flyway Migrations](https://flywaydb.org/documentation/)
