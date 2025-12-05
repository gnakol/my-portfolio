# 🏗️ Architecture Job Tracker - Plan Complet

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Endpoints disponibles](#endpoints-disponibles)
3. [Endpoints manquants](#endpoints-manquants)
4. [Architecture de sécurité](#architecture-de-sécurité)
5. [Broker : RabbitMQ vs Kafka](#broker-rabbitmq-vs-kafka)
6. [Architecture complète](#architecture-complète)
7. [Plan d'action en 3 phases](#plan-daction-en-3-phases)
8. [FAQ - Questions/Réponses](#faq---questionsréponses)

---

## 🎯 Vue d'ensemble

**Objectif** : Créer un système intelligent de suivi de candidatures qui remplace Excel par une application moderne avec :
- Automatisation du remplissage des données (scraping)
- Notifications intelligentes
- Statistiques et analytics
- Calendrier automatique
- Architecture microservices (Spring Boot + NestJS)

**Stack technique** :
- **Frontend** : Angular (portfolio-template)
- **Backend Portfolio** : Spring Boot (portfolio-api) - gère l'authentification Keycloak
- **Backend Job Tracker** : NestJS (job-track-app) - nouveau microservice
- **Auth** : Keycloak (JWT tokens)
- **Broker** : RabbitMQ (pour les tâches asynchrones)
- **Databases** : PostgreSQL (portfolio + job tracker)

---

## ✅ Endpoints disponibles

### 1. Company Module (5 endpoints)
```
GET    /api/companies          → Liste avec pagination
GET    /api/companies/:id      → Détail d'une entreprise
POST   /api/companies          → Créer une entreprise
PUT    /api/companies/:id      → Modifier une entreprise
DELETE /api/companies/:id      → Supprimer une entreprise
```

### 2. JobOffer Module (5 endpoints)
```
GET    /api/job-offers         → Liste avec pagination
GET    /api/job-offers/:id     → Détail d'une offre
POST   /api/job-offers         → Créer une offre
PUT    /api/job-offers/:id     → Modifier une offre
DELETE /api/job-offers/:id     → Supprimer une offre
```

### 3. Contact Module (5 endpoints)
```
GET    /api/contacts           → Liste avec pagination
GET    /api/contacts/:id       → Détail d'un contact
POST   /api/contacts           → Créer un contact
PUT    /api/contacts/:id       → Modifier un contact
DELETE /api/contacts/:id       → Supprimer un contact
```

### 4. StackTag Module (5 endpoints)
```
GET    /api/stack-tags         → Liste avec pagination
GET    /api/stack-tags/:id     → Détail d'un tag
POST   /api/stack-tags         → Créer un tag
PUT    /api/stack-tags/:id     → Modifier un tag
DELETE /api/stack-tags/:id     → Supprimer un tag
```

### 5. Candidacy Module (5 endpoints)
```
GET    /api/candidacies        → Liste avec pagination
GET    /api/candidacies/:id    → Détail d'une candidature
POST   /api/candidacies        → Créer une candidature
PUT    /api/candidacies/:id    → Modifier une candidature
DELETE /api/candidacies/:id    → Supprimer une candidature
```

### 6. ApplicationEvent Module (6 endpoints)
```
GET    /api/application-events                      → Liste avec pagination
GET    /api/application-events/candidacy/:id        → Events d'une candidature
GET    /api/application-events/:id                  → Détail d'un événement
POST   /api/application-events                      → Créer un événement
PUT    /api/application-events/:id                  → Modifier un événement
DELETE /api/application-events/:id                  → Supprimer un événement
```

### 7. Reminder Module (6 endpoints)
```
GET    /api/reminders                               → Liste avec pagination
GET    /api/reminders/candidacy/:id                 → Reminders d'une candidature
GET    /api/reminders/:id                           → Détail d'un reminder
POST   /api/reminders                               → Créer un reminder
PUT    /api/reminders/:id                           → Modifier un reminder
DELETE /api/reminders/:id                           → Supprimer un reminder
```

**TOTAL : 37 endpoints REST fonctionnels**

---

## ⚠️ Endpoints manquants (Features avancées)

Pour compléter le cahier des charges, il faudra ajouter :

### 1. Scraping d'URL
```
POST /api/job-offers/scrape-url
Body: { "url": "https://welcometothejungle.com/..." }
Response: Données extraites automatiquement (titre, entreprise, salaire, etc.)
```

### 2. Statistiques globales
```
GET /api/statistics/global
Response: {
  "totalCandidacies": 150,
  "responseRate": 0.35,
  "interviewRate": 0.12,
  "averageResponseTime": 7.5
}
```

### 3. Statistiques par stack
```
GET /api/statistics/by-stack
Response: [
  { "stack": "Angular", "applications": 45, "responses": 12, "interviews": 3 },
  { "stack": "Java", "applications": 60, "responses": 25, "interviews": 8 }
]
```

### 4. Statistiques par ville
```
GET /api/statistics/by-city
Response: [
  { "city": "Paris", "applications": 80, "responses": 28 },
  { "city": "Lyon", "applications": 35, "responses": 15 }
]
```

### 5. Timeline / Historique
```
GET /api/statistics/timeline?period=week|month|year
Response: Données pour graphiques temporels
```

### 6. Auto-tagging NLP
```
POST /api/job-offers/:id/analyze
Response: Tags/compétences détectés dans la description du poste
```

---

## 🔐 Architecture de sécurité

### Principe : JWT partagé entre les services

```
┌─────────────┐
│  Keycloak   │ ← Génère les tokens JWT
└──────┬──────┘
       │
       │ JWT token (avec user info + roles)
       ├──────────────────────────┐
       ↓                          ↓
┌──────────────────┐      ┌─────────────────┐
│  portfolio-api   │      │ job-track-app   │
│  (Spring Boot)   │      │   (NestJS)      │
│                  │      │                  │
│ ✅ Auth Keycloak │      │ ✅ Vérifie JWT  │
│ ✅ Spring Sec    │      │ ✅ Guard NestJS │
└────────┬─────────┘      └────────┬────────┘
         │                         │
         └─────────┬───────────────┘
                   │
            ┌──────▼─────┐
            │  Angular   │
            │ (Frontend) │
            └────────────┘
```

### Flux d'authentification

1. **User se connecte via Angular** → Keycloak
2. **Keycloak génère un JWT** contenant :
   ```json
   {
     "sub": "user-uuid",
     "preferred_username": "kolgna",
     "email": "kolgna@example.com",
     "realm_access": {
       "roles": ["user", "admin"]
     },
     "exp": 1234567890
   }
   ```
3. **Angular stocke le JWT** (localStorage)
4. **Chaque requête inclut le JWT** dans le header :
   ```
   Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
   ```
5. **portfolio-api (Spring)** vérifie le JWT avec Spring Security (déjà configuré)
6. **job-track-app (NestJS)** vérifie AUSSI le JWT avec un Guard (à configurer)

### Avantages de cette approche

✅ **Indépendance des services** : Chaque service vérifie le JWT indépendamment
✅ **Pas de dépendance inter-services** : Pas besoin que Spring appelle NestJS pour l'auth
✅ **Scalabilité** : Facile d'ajouter d'autres microservices
✅ **Sécurité** : Chaque service valide le token avec la clé publique Keycloak
✅ **Simplicité** : Angular peut appeler les 2 backends directement

---

## 🔧 Broker : RabbitMQ vs Kafka

### Cas d'usage pour un broker

Un broker sert à la **communication asynchrone** entre services :

#### Exemple 1 : Notification automatique
```
job-track-app → publie "Candidature créée"
             ↓
         RabbitMQ
             ↓
    Email Service → envoie un email de confirmation
```

#### Exemple 2 : Scraping en background
```
Angular → POST /api/job-offers/scrape-url
                ↓
          job-track-app → publie "URL à scraper"
                ↓
            RabbitMQ
                ↓
          Scraper Worker → scrape l'URL en background
                ↓
          job-track-app → met à jour la DB
```

#### Exemple 3 : Analytics temps réel
```
job-track-app → publie "Event candidature"
             ↓
          RabbitMQ
             ↓
    Analytics Service → calcule stats en temps réel
```

### Comparaison RabbitMQ vs Kafka

| Critère | RabbitMQ | Kafka |
|---------|----------|-------|
| **Complexité setup** | ⭐⭐ Simple (1 container) | ⭐⭐⭐⭐ Complexe (Kafka + Zookeeper) |
| **Use case principal** | Task queues, jobs async | Event streaming, big data |
| **Latence** | ~1ms | ~5-10ms |
| **Persistance** | Messages supprimés après consommation | Messages gardés (retention) |
| **Scalabilité** | Bonne (< 100k msg/s) | Excellente (> 1M msg/s) |
| **Learning curve** | Facile | Moyenne |
| **Ton besoin** | ✅ **PARFAIT** | ⚠️ Overkill pour commencer |

### 🎯 Recommandation : **RabbitMQ**

**Pourquoi ?**
1. Plus simple à configurer (docker-compose suffit)
2. Parfaitement adapté pour :
   - Envoyer des emails de notification
   - Programmer des rappels automatiques
   - Scraper des URLs en background
3. Performance suffisante pour ton use case (< 10k candidatures/jour)
4. Tu peux migrer vers Kafka plus tard si nécessaire

**Configuration Docker** :
```yaml
# Ajouter dans job-track-service/docker-compose.yml
rabbitmq:
  image: rabbitmq:3-management-alpine
  container_name: job_tracker_rabbitmq
  ports:
    - "5672:5672"   # AMQP
    - "15672:15672" # Management UI
  environment:
    RABBITMQ_DEFAULT_USER: job_tracker_user
    RABBITMQ_DEFAULT_PASS: job_tracker_password123
  networks:
    - job_tracker_network
  healthcheck:
    test: ["CMD", "rabbitmq-diagnostics", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
```

---

## 🏗️ Architecture complète

### Phase 1 : Setup Auth + CRUD (MAINTENANT)

```
┌─────────────────────────────────────────────────────┐
│              Keycloak (Authentication)               │
│  • Génère JWT tokens                                 │
│  • Gère les users et roles                           │
└──────────────────────┬──────────────────────────────┘
                       │ JWT
         ┌─────────────┴──────────────┐
         ↓                            ↓
┌─────────────────┐          ┌──────────────────┐
│  portfolio-api  │          │  job-track-app   │
│  (Spring Boot)  │          │    (NestJS)      │
│  Port: 8080     │          │  Port: 3001      │
│                 │          │                  │
│ • Auth Keycloak │          │ • Vérifie JWT    │
│ • CRUD Portfolio│          │ • CRUD Candidacy │
│ • Spring Sec    │          │ • Guard NestJS   │
│ • /api/...      │          │ • /api/...       │
└─────────────────┘          └──────────────────┘
         ↑                            ↑
         └────────────┬───────────────┘
                      │ HTTP requests avec JWT header
              ┌───────▼────────┐
              │    Angular     │
              │  Port: 4200    │
              │                │
              │ • Login via KC │
              │ • Stocke JWT   │
              │ • 2 services:  │
              │   - Portfolio  │
              │   - JobTracker │
              └────────────────┘
```

**Angular appelle directement les 2 backends avec le même JWT !**

### Phase 2 : Features avancées avec RabbitMQ (APRÈS)

```
┌─────────────────────────────────────────────────────┐
│              Keycloak (Authentication)               │
└──────────────────────┬──────────────────────────────┘
                       │ JWT
         ┌─────────────┴──────────────┐
         ↓                            ↓
┌─────────────────┐          ┌──────────────────┐
│  portfolio-api  │          │  job-track-app   │
│  (Spring Boot)  │          │    (NestJS)      │
└─────────────────┘          └────────┬─────────┘
         ↑                            │
         │                            │ publishes events
         │                            ↓
         │                   ┌────────────────┐
         │                   │   RabbitMQ     │
         │                   │   Port: 5672   │
         │                   │   UI: 15672    │
         │                   └────────┬───────┘
         │                            │ consumes events
         │                   ┌────────┴───────────────┐
         │                   ↓                        ↓
         │          ┌────────────────┐      ┌────────────────┐
         │          │ Email Worker   │      │ Scraper Worker │
         │          │  (NestJS/Node) │      │  (Puppeteer)   │
         │          │                │      │                │
         │          │ • Send emails  │      │ • Scrape URLs  │
         │          │ • Notifications│      │ • Parse data   │
         │          └────────────────┘      └────────────────┘
         │
    ┌────▼─────┐
    │ Angular  │
    └──────────┘
```

### Phase 3 : Analytics & Advanced Features (FUTUR)

```
                    ┌─────────────┐
                    │  Keycloak   │
                    └──────┬──────┘
                           │ JWT
         ┌─────────────────┼─────────────────┐
         ↓                 ↓                  ↓
  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
  │portfolio-api│  │job-track-app │  │analytics-svc │
  └─────────────┘  └──────┬───────┘  └──────┬───────┘
         ↑                │                  │
         │                ↓                  ↓
         │         ┌─────────────┐    ┌──────────────┐
         │         │  RabbitMQ   │    │  Redis Cache │
         │         └──────┬──────┘    │  (Stats)     │
         │                │           └──────────────┘
         │       ┌────────┴────────┐
         │       ↓                 ↓
         │  ┌──────────┐    ┌────────────┐
         │  │  Email   │    │  Scraper   │
         │  │  Worker  │    │  Worker    │
         │  └──────────┘    └────────────┘
         │
    ┌────▼─────┐
    │ Angular  │
    │          │
    │ • Charts │
    │ • Stats  │
    └──────────┘
```

---

## 📅 Plan d'action en 3 phases

### 🔥 PHASE 1 : Sécuriser job-track-app (À FAIRE MAINTENANT)

**Objectif** : Protéger tous les endpoints NestJS avec JWT Keycloak

#### Étapes :

1. **Installer les dépendances NestJS pour JWT**
   ```bash
   cd job-track-service/job-track-app
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt jwks-rsa
   ```

2. **Créer un module Auth dans NestJS**
   ```
   src/auth/
   ├── guards/
   │   └── jwt-auth.guard.ts      # Guard pour protéger les routes
   ├── strategies/
   │   └── jwt.strategy.ts        # Stratégie de vérification JWT
   ├── auth.module.ts
   └── auth.service.ts
   ```

3. **Configurer la connexion à Keycloak**
   - Récupérer la clé publique RSA depuis Keycloak
   - Configurer JwtStrategy pour valider les tokens
   - Extraire les infos user (email, roles, etc.)

4. **Protéger tous les endpoints**
   ```typescript
   @Controller('companies')
   @UseGuards(JwtAuthGuard)  // ← Protège toutes les routes
   export class CompanyController {
     // ...
   }
   ```

5. **Tester l'authentification**
   - Se connecter via Angular
   - Récupérer le JWT
   - Faire un appel à job-track-app avec le JWT
   - Vérifier que ça fonctionne ✅

**Durée estimée** : 2-3 heures

---

### 🚀 PHASE 2 : Connecter Angular aux 2 backends

**Objectif** : Angular consomme portfolio-api ET job-track-app

#### Étapes :

1. **Créer un service Angular pour Job Tracker**
   ```typescript
   // src/app/services/job-tracker.service.ts
   export class JobTrackerService {
     private apiUrl = 'http://localhost:3001/api';

     constructor(private http: HttpClient) {}

     // Ajoute automatiquement le JWT dans les headers
     getCandidacies() {
       return this.http.get(`${this.apiUrl}/candidacies`);
     }
   }
   ```

2. **Configurer l'intercepteur HTTP**
   ```typescript
   // Interceptor déjà existant dans ton projet Angular
   // S'assurer qu'il ajoute le JWT pour les 2 backends
   intercept(req: HttpRequest<any>, next: HttpHandler) {
     const token = this.authService.getToken();
     if (token) {
       req = req.clone({
         setHeaders: { Authorization: `Bearer ${token}` }
       });
     }
     return next.handle(req);
   }
   ```

3. **Créer les composants Angular pour Job Tracker**
   ```
   src/app/job-tracker/
   ├── components/
   │   ├── candidacy-list/
   │   ├── candidacy-form/
   │   ├── company-list/
   │   └── statistics/
   ├── services/
   │   └── job-tracker.service.ts
   └── job-tracker.module.ts
   ```

4. **Tester le flow complet**
   - Login via Keycloak
   - Naviguer vers la section Job Tracker
   - Créer/modifier/supprimer des candidatures
   - Vérifier que les appels passent bien

**Durée estimée** : 1 semaine

---

### 💪 PHASE 3 : Features avancées + RabbitMQ

**Objectif** : Ajouter scraping, notifications, statistiques

#### Étapes :

1. **Setup RabbitMQ**
   - Ajouter au docker-compose.yml
   - Installer `@nestjs/microservices` et `amqplib`
   - Configurer les queues (emails, scraping, etc.)

2. **Implémenter le scraping d'URL**
   - Endpoint `POST /api/job-offers/scrape-url`
   - Worker Puppeteer/Cheerio pour scraper
   - Publier job dans RabbitMQ
   - Worker consomme et scrappe en background

3. **Système de notifications**
   - Créer un Email Worker (consomme RabbitMQ)
   - Configurer Nodemailer ou SendGrid
   - Programmer des rappels automatiques (J+3, J+7, J+14)

4. **Module de statistiques**
   - Endpoints stats (global, by-stack, by-city)
   - Calculs avec TypeORM queries
   - Cache avec Redis pour performances

5. **Dashboard Angular**
   - Intégrer Chart.js ou ApexCharts
   - Afficher les graphiques
   - Timeline des événements

**Durée estimée** : 2-3 semaines

---

## ❓ FAQ - Questions/Réponses

### Q1 : Angular doit passer par Spring avant d'atteindre NestJS ?

**R : NON !**

Angular peut appeler directement les 2 services :
```
Angular → portfolio-api (pour auth, portfolio data)
Angular → job-track-app (pour candidatures)
```

Chaque service vérifie le JWT **indépendamment**.

---

### Q2 : Faut-il déclarer job-track-app dans Keycloak ?

**R : OUI et NON**

- **NON** : Pas besoin de créer un nouveau "client" Keycloak pour job-track-app
- **OUI** : job-track-app doit connaître :
  - L'URL de Keycloak
  - Le realm
  - La clé publique (pour vérifier les JWT)

Configuration dans `.env` :
```env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=portfolio-realm
KEYCLOAK_CLIENT_ID=portfolio-api  # Même client que Spring
```

---

### Q3 : Qui protège quel endpoint ?

**R : Chaque service protège ses propres endpoints**

- **portfolio-api** : protège `/api/portfolio/**`, `/api/users/**`, etc.
- **job-track-app** : protège `/api/companies/**`, `/api/candidacies/**`, etc.

Les 2 utilisent la **même source de vérité** : le JWT Keycloak.

---

### Q4 : Qui appelle qui ?

**R : Communication directe limitée**

```
Angular → portfolio-api ✅
Angular → job-track-app ✅
job-track-app → RabbitMQ → Workers ✅
portfolio-api ↔ job-track-app ❌ (pas nécessaire pour l'instant)
```

**Important** : Les services communiquent via RabbitMQ (async), pas en HTTP direct.

---

### Q5 : Pourquoi pas d'API Gateway ?

**R : Pas nécessaire pour 2 services**

Un API Gateway (Kong, Nginx, etc.) serait utile si tu avais :
- 5+ microservices
- Besoin de rate limiting
- Besoin de load balancing

Pour 2 services, c'est **overkill**. Angular peut gérer 2 URLs facilement.

---

### Q6 : Comment gérer les CORS ?

**R : Configurer CORS dans chaque service**

**portfolio-api (Spring)** :
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

**job-track-app (NestJS)** :
```typescript
// main.ts (déjà configuré)
app.enableCors({
  origin: ['http://localhost:4200'],
  credentials: true,
});
```

---

### Q7 : Quelle base de données pour chaque service ?

**R : Chaque service a sa propre DB**

```
portfolio-api → PostgreSQL (port 5432)
  └─ schema: portfolio_db

job-track-app → PostgreSQL (port 5433)
  └─ schema: job_tracker_db
```

**Principe des microservices** : Chaque service gère sa propre base de données (database per service pattern).

---

### Q8 : Comment tester l'authentification JWT ?

**R : Utiliser Postman ou cURL**

1. **Obtenir un JWT depuis Keycloak** :
```bash
curl -X POST "http://localhost:8080/realms/portfolio-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=portfolio-api" \
  -d "username=kolgna" \
  -d "password=ton_password" \
  -d "grant_type=password"
```

2. **Tester un endpoint protégé** :
```bash
curl -X GET "http://localhost:3001/api/companies" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."
```

---

## 📊 Résumé - Checklist

### ✅ Fait
- [x] 7 modules NestJS créés (37 endpoints)
- [x] Architecture propre (entities, DTOs, services, controllers)
- [x] TypeORM configuré avec PostgreSQL
- [x] Redis configuré
- [x] Validation avec class-validator
- [x] Logging NestJS
- [x] Error handling robuste
- [x] Pagination sur tous les endpoints

### 🔥 À faire - Phase 1 (PRIORITAIRE)
- [ ] Installer packages JWT NestJS
- [ ] Créer module Auth avec Guard JWT
- [ ] Configurer connexion Keycloak
- [ ] Protéger tous les endpoints
- [ ] Tester authentification

### 🚀 À faire - Phase 2
- [ ] Créer service Angular pour Job Tracker
- [ ] Configurer intercepteur HTTP
- [ ] Créer composants Angular
- [ ] Tester flow complet

### 💪 À faire - Phase 3
- [ ] Setup RabbitMQ
- [ ] Implémenter scraping
- [ ] Système de notifications
- [ ] Module statistiques
- [ ] Dashboard Angular

---

## 🎯 Prochaine action

**Commencer par la Phase 1** : Sécuriser job-track-app avec JWT Keycloak

Commande à exécuter :
```bash
cd job-track-service/job-track-app
npm install @nestjs/jwt @nestjs/passport passport passport-jwt jwks-rsa
```

---

*Document créé le 2025-12-04*
*Projet : Job Tracker Microservice*
*Auteur : Architecture technique*
