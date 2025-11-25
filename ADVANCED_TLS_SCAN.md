# 🔐 Advanced SSL/TLS Security Scanner

## Vue d'ensemble

Scan de sécurité SSL/TLS ultra-avancé qui va **bien au-delà** de ce que Grafana et Prometheus peuvent faire.

### ✨ Fonctionnalités Uniques

Cette fonctionnalité offre une analyse de sécurité complète que **ni Grafana ni Prometheus ne peuvent réaliser** :

#### 1. Analyse des Versions TLS
- ✅ Détection TLS 1.0 (vulnérable - obsolète)
- ✅ Détection TLS 1.1 (obsolète)
- ✅ Détection TLS 1.2 (recommandé)
- ✅ Détection TLS 1.3 (moderne)

#### 2. Analyse des Cipher Suites
- Identification des cipher suites supportés
- Détection des ciphers **faibles** (RC4, DES, 3DES)
- Détection des ciphers **forts** (AES-GCM, ChaCha20)
- Vérification Perfect Forward Secrecy (PFS)

#### 3. Détection de Vulnérabilités
- **POODLE** : SSLv3 vulnerability
- **BEAST** : CBC cipher vulnerability (TLS 1.0)
- **Heartbleed** : OpenSSL critical bug
- **CRIME** : TLS compression attack

#### 4. Analyse de Certificat Complète
- Subject et Issuer
- Dates de validité
- Algorithme de signature
- Jours avant expiration
- Vérification de la chaîne de certificats

#### 5. Score de Sécurité
- **Grade** : A+, A, B, C, D, F (comme SSL Labs)
- **Score** : 0-100 avec calcul détaillé
- **Warnings** : Liste des problèmes détectés
- **Recommendations** : Actions correctives

---

## 🚀 Utilisation

### Interface Web

1. Aller dans **Mission Control** → Section "Historique Sécurité TLS"
2. Entrer le domaine : `kolie-portfolio.org:443`
3. Cliquer sur le bouton **"Advanced Scan"** (bouton orange avec effet brillant)
4. Attendre le scan (quelques secondes)
5. Consulter les résultats dans le modal détaillé

### API Backend

#### Endpoint Principal

```http
POST /portfolio-api/security-status/advanced-scan?hostPort=kolie-portfolio.org:443
Authorization: Bearer <token>
```

**Réponse** :
```json
{
  "id": 1,
  "target": "kolie-portfolio.org:443",
  "scannedAt": "2025-11-15T18:00:00Z",
  "securityGrade": "A",
  "securityScore": 92,
  "daysUntilExpiry": 89,
  "supportsTls10": false,
  "supportsTls11": false,
  "supportsTls12": true,
  "supportsTls13": true,
  "vulnerableToPoodle": false,
  "vulnerableToBeast": false,
  "hasStrongCiphers": true,
  "hasWeakCiphers": false,
  "supportsPfs": true,
  "warnings": "",
  "recommendations": "",
  "passed": true
}
```

#### Autres Endpoints

```http
# Récupérer le dernier scan
GET /portfolio-api/security-status/advanced-scan/latest?target=kolie-portfolio.org:443

# Récupérer tous les scans (10 derniers)
GET /portfolio-api/security-status/advanced-scan/all

# Récupérer l'historique pour un domaine
GET /portfolio-api/security-status/advanced-scan/history?target=kolie-portfolio.org:443
```

---

## 📊 Calcul du Score de Sécurité

### Points de Départ
- **Score initial** : 100

### Pénalités

| Critère | Pénalité | Justification |
|---------|----------|---------------|
| TLS 1.0 supporté | -30 | Obsolète, vulnérabilités connues |
| TLS 1.1 supporté | -20 | Obsolète depuis 2021 |
| Cipher suites faibles | -25 | RC4, DES, 3DES non sécurisés |
| Vulnérable à POODLE | -20 | Attaque SSLv3 |
| Vulnérable à BEAST | -15 | Attaque TLS 1.0 CBC |
| Certificat < 30 jours | -10 | Risque d'expiration |

### Bonus

| Critère | Bonus | Justification |
|---------|-------|---------------|
| TLS 1.3 supporté | +5 | Protocole moderne |
| Perfect Forward Secrecy | +5 | Sécurité renforcée |
| Strong ciphers uniquement | +5 | AES-GCM, ChaCha20 |

### Attribution du Grade

```
Score >= 95  →  A+
Score >= 85  →  A
Score >= 75  →  B
Score >= 60  →  C
Score >= 40  →  D
Score < 40   →  F
```

---

## 🗄️ Base de Données

Table : `tls_security_scans`

```sql
CREATE TABLE tls_security_scans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    target VARCHAR(255),
    scanned_at TIMESTAMP,

    -- Certificat
    certificate_subject VARCHAR(500),
    certificate_issuer VARCHAR(500),
    days_until_expiry INT,
    signature_algorithm VARCHAR(100),

    -- Versions TLS
    supports_tls10 BOOLEAN,
    supports_tls11 BOOLEAN,
    supports_tls12 BOOLEAN,
    supports_tls13 BOOLEAN,

    -- Cipher Suites
    supported_ciphers TEXT,
    has_weak_ciphers BOOLEAN,
    has_strong_ciphers BOOLEAN,
    supports_pfs BOOLEAN,

    -- Vulnérabilités
    vulnerable_to_poodle BOOLEAN,
    vulnerable_to_beast BOOLEAN,
    vulnerable_to_heartbleed BOOLEAN,
    vulnerable_to_crime BOOLEAN,

    -- Score
    security_grade VARCHAR(10),
    security_score INT,
    warnings VARCHAR(1000),
    recommendations VARCHAR(1000),
    passed BOOLEAN
);
```

---

## 🎨 Interface Utilisateur

### Modal de Résultats

Le modal affiche de manière visuelle :

1. **Grade de Sécurité** : Gros badge coloré (A+ vert, F rouge)
2. **Score** : X/100 avec barre de progression
3. **Certificat** : Infos détaillées + jours restants
4. **Versions TLS** : 4 badges (TLS 1.0, 1.1, 1.2, 1.3)
5. **Vulnérabilités** : 4 indicateurs (POODLE, BEAST, Heartbleed, CRIME)
6. **Features** : Perfect Forward Secrecy, Strong Ciphers, etc.
7. **Warnings & Recommendations** : Conseils d'amélioration

---

## 🔧 Stack Technique

### Backend
- **Java 17** + **Spring Boot 3.x**
- **JDK SSL/TLS Libraries** : SSLContext, SSLSocket
- **JPA/Hibernate** : Persistence des scans
- **MySQL** : Stockage historique

### Frontend
- **Angular 18**
- **Tailwind CSS** : Design moderne
- **Material Angular** : Composants UI
- **RxJS** : Gestion asynchrone

---

## 🆚 Comparaison avec Grafana/Prometheus

| Fonctionnalité | Grafana/Prometheus | Advanced TLS Scanner |
|----------------|-------------------|---------------------|
| Détection versions TLS | ❌ | ✅ |
| Analyse cipher suites | ❌ | ✅ |
| Détection vulnérabilités | ❌ | ✅ |
| Score de sécurité | ❌ | ✅ (A+ à F) |
| Recommandations | ❌ | ✅ |
| Historique complet | ❌ | ✅ |
| Perfect Forward Secrecy | ❌ | ✅ |
| Certificate chain analysis | ❌ | ✅ |

**Verdict** : Cette fonctionnalité offre une **valeur ajoutée unique** que les outils de monitoring classiques ne peuvent pas fournir.

---

## 📝 TODO Futur

- [ ] Ajouter support OCSP Stapling
- [ ] Vérifier HSTS headers (HTTP Strict Transport Security)
- [ ] Détection Certificate Transparency
- [ ] Export PDF des résultats de scan
- [ ] Alertes automatiques si grade < B
- [ ] Graphiques d'évolution du score dans le temps
- [ ] Scan planifié (daily/weekly)

---

## 👨‍💻 Auteur

**N'gna KOLIE**
Développeur FullStack | DevOps | Sécurité
