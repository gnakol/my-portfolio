# 🛡️ GUIDE COMPLET - Simulation Firewall Attack Blocker

## 📋 Vue d'ensemble

Cette simulation immersive met le joueur dans la peau d'un **Analyste SOC** devant répondre en temps réel à une attaque DDoS multi-vecteurs contre un site e-commerce lors du Black Friday.

**Durée :** 60 secondes
**Objectif :** Bloquer un maximum d'attaques pour sauver le chiffre d'affaires du client
**Difficulté :** Intermédiaire à Avancé

---

## 🎯 Scénario

### Contexte
- **Client :** TechShop (leader e-commerce France)
- **Date :** Black Friday - 14h27
- **Trafic normal :** 2 000 req/s
- **Trafic actuel :** 45 000 req/s ⚠️
- **Impact financier :** 5 000€/seconde de perte

### Mission
Identifier et bloquer les attaques multi-vecteurs avant que l'infrastructure soit compromise. Chaque seconde compte !

---

## 🚀 Comment jouer ?

### Étape 1 : Démarrage

1. **Accéder à la simulation**
   - Naviguez vers la page de simulation : `/firewall-blocked-simulation`
   - Vous verrez la page d'accueil avec le briefing opérationnel

2. **Entrer votre pseudo (OBLIGATOIRE)**
   - Cliquez sur le bouton **"PARTICIPER AU CLASSEMENT"**
   - Un champ de saisie apparaîtra
   - Entrez votre pseudo (max 20 caractères)
   - ⚠️ **Sans pseudo, le bouton "INITIER LA SÉQUENCE" reste désactivé**

3. **Lancer la simulation**
   - Cliquez sur **"INITIER LA SÉQUENCE"**
   - Le dashboard SOC se charge immédiatement
   - Le timer de 60 secondes démarre automatiquement

### Étape 2 : Interface du Dashboard SOC

Une fois dans le jeu, vous verrez 4 panneaux principaux :

#### 📊 Panel 1 : TRAFFIC MONITOR (en haut à gauche)
- **Graphique en temps réel** du trafic réseau
- **Indicateurs :**
  - `Current` : Trafic actuel en req/s
  - `Normal` : Trafic normal de référence (2000 req/s)
  - `Status` : MONITORING ou CRITICAL

#### 🐛 Panel 2 : THREAT INTELLIGENCE (en haut à droite)
- Liste des **attaques actives**
- Chaque attaque affiche :
  - Type d'attaque (DDoS HTTP, SYN Flood, etc.)
  - IP source + Pays
  - Port cible / Protocole
  - Taux de requêtes (req/s)
  - Statut : ACTIVE ou BLOCKED
- Couleurs :
  - 🔴 CRITICAL : attaque très dangereuse
  - 🟠 HIGH : attaque importante
  - ⚪ Autres

#### 💻 Panel 3 : FIREWALL CONSOLE (en bas à gauche)
- **Terminal interactif** pour taper les commandes
- Historique des logs en temps réel
- Autocomplétion des commandes
- Navigation historique avec ↑ et ↓

#### 🖥️ Panel 4 : INFRASTRUCTURE (en bas à droite)
- État des serveurs protégés :
  - WEB-01 (serveur web)
  - DB-01 (base de données)
  - AD-01 (Active Directory)
- Nombre de règles actives créées

#### 🎯 HUD (Heads-Up Display en haut)
- **TIME** : Temps restant (compte à rebours)
- **BLOCKED** : Attaques bloquées / Total
- **SCORE** : Score actuel
- **SAVED** : Chiffre d'affaires sauvé (€)
- **ALERT** : Niveau d'alerte de 1 à 10

---

## ⌨️ Commandes disponibles

### Commandes d'information

```bash
help
```
- Affiche la liste complète des commandes disponibles

```bash
show attacks
```
- Liste toutes les attaques actives (non bloquées)
- Affiche les détails techniques (IP, port, protocole, taux)

```bash
show threat-intel
```
- Affiche le fil de renseignement sur les menaces
- Montre toutes les attaques (actives ET bloquées)

```bash
clear
```
- Efface l'historique du terminal

---

### Commandes de blocage

#### 🎯 Bloquer par IP
```bash
block ip 185.220.101.45
```
- Bloque **toutes les attaques** provenant de cette IP spécifique
- ✅ **Efficacité maximale** si toutes les attaques viennent de la même IP

#### 🎯 Bloquer par Port + Protocole
```bash
block proto=tcp port=80
```
- Bloque tout le trafic TCP sur le port 80
- Utile pour bloquer plusieurs attaques HTTP ciblant le même port

#### 🎯 Bloquer par Port uniquement
```bash
block port=443
```
- Bloque tout le trafic (TCP + UDP) sur le port 443
- ⚠️ Peut impacter le service légitime

#### 🎯 Rate Limiting HTTP
```bash
rate-limit http 1000/s
```
- Limite le taux de requêtes HTTP à 1000/s
- **Non implémenté actuellement** (pour future version)

#### 🎯 Drop de paquets volumineux
```bash
drop proto=udp port=53 size>512
```
- Supprime les paquets UDP sur le port 53 de plus de 512 octets
- **Non implémenté actuellement** (pour future version)

---

## 🎮 Stratégies de jeu

### 🥇 Stratégie "Sniper" (Précision maximale)
**Principe :** Bloquer chaque attaque individuellement par IP

**Méthode :**
1. Tapez `show attacks` pour lister les menaces
2. Pour chaque attaque, utilisez : `block ip <IP_SOURCE>`
3. Recommencez jusqu'à tout bloquer

**Avantages :**
- Bloque 100% de l'attaque ciblée
- Pas de risque de bloquer du trafic légitime

**Inconvénients :**
- Lent (nécessite une commande par attaque)
- Risque de manquer de temps

**Exemple :**
```bash
show attacks
block ip 185.220.101.45
block ip 91.203.5.87
block ip 103.85.24.156
# ... etc
```

---

### 🥈 Stratégie "Cluster" (Équilibre)
**Principe :** Regrouper les attaques par port ou protocole

**Méthode :**
1. Identifiez les ports les plus attaqués
2. Bloquez par `proto=X port=Y`
3. Complétez avec des blocages IP si nécessaire

**Avantages :**
- Plus rapide que la stratégie Sniper
- Bloque plusieurs attaques à la fois

**Inconvénients :**
- Peut bloquer du trafic légitime sur le même port

**Exemple :**
```bash
show attacks
# Si 3 attaques sur port 80 TCP
block proto=tcp port=80
# Si 2 attaques sur port 443
block port=443
```

---

### 🥉 Stratégie "Shotgun" (Vitesse)
**Principe :** Bloquer tous les ports suspects en masse

**Méthode :**
1. Tapez rapidement `block port=X` pour chaque port attaqué
2. Ne pas chercher à analyser

**Avantages :**
- Très rapide
- Utile si peu de temps restant

**Inconvénients :**
- Risque élevé d'interrompre le service légitime
- Score moins bon

---

## 📊 Système de scoring

### Calcul du score

#### Points gagnés
- **Attaque bloquée** : +1000 points de base
- **Bonus de sévérité :**
  - CRITICAL : x2.0 (= 2000 points)
  - HIGH : x1.5 (= 1500 points)
  - MEDIUM : x1.2 (= 1200 points)
  - LOW : x1.0 (= 1000 points)

#### Bonus de temps
- **Blocage rapide** : Bonus proportionnel au temps restant
- Formule : `bonus = (tempsRestant / 60) * 500`

**Exemple :**
- Bloquer une attaque CRITICAL à t=50s : 2000 + (50/60)*500 = **2416 points**
- Bloquer une attaque HIGH à t=10s : 1500 + (10/60)*500 = **1583 points**

#### Chiffre d'affaires sauvé
- **5 000€ par seconde** de jeu restante
- Si vous terminez en 20 secondes : `(60-20) * 5000 = 200 000€`

---

### Grades obtenus

Le grade dépend du **taux de blocage** :

| Taux de blocage | Grade |
|----------------|-------|
| ≥ 90% | **Elite Blue Teamer** 🏆 |
| 70-89% | **Senior SOC Analyst** ⭐ |
| 50-69% | **SOC Analyst** 🛡️ |
| < 50% | **Junior SOC** 🔰 |

**Formule :**
```
Taux de blocage = (Attaques bloquées / Total attaques) * 100
```

---

## 🏆 Classement & TOP 10

### Critères de validation pour le classement

⚠️ **Important** : Pour apparaître dans le classement, il faut :
1. ✅ Avoir joué **au moins 5 secondes**
2. ✅ Avoir créé **au moins 1 règle firewall**
3. ✅ Avoir entré un **pseudo valide**

Si ces conditions ne sont **PAS** respectées :
- Votre score est enregistré en base
- Mais `isTop10 = false` automatiquement
- Aucune félicitation ne s'affiche

### Comment atteindre le TOP 10 ?

**Formule gagnante :**
- Bloquer **100% des attaques** (6/6 généralement)
- Le plus **rapidement possible** (< 30 secondes idéal)
- Priorité aux attaques **CRITICAL** et **HIGH**

**Exemple de session TOP 10 :**
```
Score : 8950 points
Grade : Elite Blue Teamer
Attaques : 6/6 (100%)
Temps : 24 secondes
CA sauvé : 180 000€
```

---

## ❌ Comment perdre ?

### Conditions de défaite

Il n'y a **pas de Game Over** strict, mais vous obtiendrez un **mauvais résultat** si :
- Le **timer atteint 0** avant d'avoir tout bloqué
- Taux de blocage < 50% → Grade "Junior SOC"
- Score très faible (< 2000 points)

### Erreurs fréquentes

1. **Perte de temps**
   - Taper `help` plusieurs fois
   - Analyser trop longtemps au lieu d'agir
   - Taper des commandes invalides

2. **Mauvaise stratégie**
   - Bloquer les attaques LOW en premier
   - Oublier de vérifier les attaques restantes
   - Créer des règles redondantes

3. **Fautes de frappe**
   - Oublier le `=` dans `proto=tcp`
   - Mauvaise syntaxe : `block 185.220.101.45` au lieu de `block ip 185.220.101.45`
   - Espaces en trop

---

## 🎯 Astuces de pro

### Optimisation du temps
- Utilisez **↑** pour rappeler la dernière commande
- Tapez les premières lettres d'une commande et appuyez sur **Tab** (si autocomplétion disponible)
- Mémorisez les commandes avant de lancer la simulation

### Analyse rapide
- Regardez d'abord le **Panel THREAT INTELLIGENCE** pour compter les attaques
- Identifiez les attaques **CRITICAL** (en rouge) en priorité
- Notez si plusieurs attaques partagent le même port → bloquez par port

### Commandes efficaces
```bash
# Séquence optimale pour 6 attaques
show attacks
block ip <IP1>
block ip <IP2>
block ip <IP3>
block ip <IP4>
block ip <IP5>
block ip <IP6>
```

### Vérification finale
- Tapez `show attacks` une dernière fois pour vérifier
- Si la liste est vide → "✅ No active attacks detected"
- Attendez la fin du timer pour maximiser le CA sauvé

---

## 🐛 Résolution de problèmes

### Problème : Le bouton "INITIER LA SÉQUENCE" est grisé
**Cause :** Vous n'avez pas cliqué sur "PARTICIPER AU CLASSEMENT" ou le pseudo est vide
**Solution :** Cliquez sur "PARTICIPER AU CLASSEMENT" et entrez un pseudo

### Problème : La commande ne fait rien
**Cause :** Syntaxe incorrecte
**Solution :** Tapez `help` pour voir les exemples de syntaxe correcte

### Problème : J'ai bloqué une attaque mais elle est toujours là
**Cause :** La commande n'a pas matché l'attaque (mauvaise IP/port)
**Solution :** Vérifiez avec `show attacks` que vous ciblez la bonne IP/port

### Problème : "Félicitations TOP 10" alors que j'ai rien fait
**Cause :** Bug corrigé ! Vous utilisez une ancienne version
**Solution :** Redémarrez le backend Spring Boot pour appliquer le correctif

### Problème : Le timer est à 0 mais le jeu ne se termine pas
**Cause :** Bug réseau ou backend injoignable
**Solution :** Rafraîchissez la page (F5) et recommencez

---

## 📝 Checklist avant de jouer

- [ ] Backend Spring Boot démarré (`mvn spring-boot:run`)
- [ ] Frontend Angular démarré (`ng serve`)
- [ ] Base de données accessible (MySQL)
- [ ] J'ai lu ce guide entièrement
- [ ] J'ai un pseudo prêt (max 20 caractères)
- [ ] Je connais au moins 3 commandes par cœur

---

## 🎓 Pédagogie

### Ce que vous apprenez

1. **Réponse à incident** : Prise de décision rapide sous pression
2. **Commandes firewall** : Syntaxe iptables-like
3. **Analyse de menaces** : Identifier les vecteurs d'attaque
4. **Priorisation** : Traiter les menaces CRITICAL en premier
5. **Gestion du temps** : Optimiser les actions dans un temps limité

### Compétences renforcées

- **SOC Analyst** : Surveillance et réponse aux incidents
- **Blue Team** : Défense active contre les cyberattaques
- **Firewall Administration** : Configuration de règles de sécurité
- **DDoS Mitigation** : Techniques de mitigation DDoS

---

## 🔧 Architecture technique (pour développeurs)

### Stack
- **Frontend** : Angular 18 (standalone components)
- **Backend** : Spring Boot 3.x + JPA
- **BDD** : MySQL
- **Temps réel** : REST API (pas de WebSocket pour cette version)

### Flow de jeu

1. **POST** `/api/simulation/firewall/start` → Initialise la session + attaques
2. **POST** `/api/simulation/firewall/execute-rule` → Exécute une règle firewall
3. **POST** `/api/simulation/firewall/end` → Termine la session + calcule résultats
4. **GET** `/api/simulation/firewall/leaderboard` → Récupère le TOP 10

### Modèles de données

**Session** : sessionUuid, playerPseudo, finalScore, attacksBlocked, totalAttacks, etc.
**AttackEvent** : attackType, sourceIp, targetPort, protocol, severity, isBlocked
**PlayerScore** : grade, blockRate, leaderboardRank, isTop10

---

## 📞 Support

En cas de bug ou de question :
- 📧 Contactez le développeur : [votre email]
- 🐛 Signalez un bug sur GitHub : [lien repo]

---

**Bonne chance, Analyste ! 🛡️🔥**
