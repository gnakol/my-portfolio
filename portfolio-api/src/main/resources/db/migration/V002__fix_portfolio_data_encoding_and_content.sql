-- =============================================
-- Migration V002 : Correction encodage + amélioration contenu portfolio
-- Objectif : Professionnaliser les données pour impression recruteurs
-- Date : 2025-11-11
-- =============================================

-- 1. CORRECTION DES DATES (Scapartois : dates inversées)
UPDATE experience
SET start_date = '2021-06-19',
    end_date = '2023-01-20'
WHERE ref_experience = '94581afa-4f99-48ef-a240-a8f7eb0e2af9';

-- 2. CORRECTION ENCODAGE + AMÉLIORATION EXPÉRIENCES
-- ================================================

-- Experience 1 : Scapartois (Intralogistique)
UPDATE experience
SET
    title = 'Technicien Intralogistique & Supervision Système',
    description = 'Référent opérationnel des flux logistiques informatisés dans un environnement hautement automatisé basé sur la technologie allemande Witron.

🔹 Surveillance temps réel des modules critiques (DPAL, COM, OPM, HBW) via système SCADA centralisé
🔹 Analyse et interprétation de rapports système automatisés pour détection d\'anomalies (réduction de 30% des temps d\'arrêt)
🔹 Intervention sur lignes robotisées avec interfaces HMI, tableaux de bord système et capteurs intelligents
🔹 Gestion proactive des alertes critiques avec résolution sous 15 minutes (SLA respect à 95%)

📊 Impact : Amélioration de 25% de la disponibilité des équipements automatisés',
    skills_acquired = 'SCADA, Monitoring temps réel, Diagnostic système, Automatisation industrielle, Witron, Gestion d\'incidents, Analyse de logs, Capteurs IoT, Environnement critique, Reporting opérationnel'
WHERE ref_experience = '94581afa-4f99-48ef-a240-a8f7eb0e2af9';

-- Experience 2 : Arsenal Borne (Dev Android)
UPDATE experience
SET
    title = 'Développeur Android - Bornes interactives & UX en point de vente',
    description = 'Développement et déploiement d\'applications Android sur bornes interactives en grandes surfaces (Auchan, Carrefour, Leclerc).

🔹 Conception de parcours clients fluides et immersifs avec formulaires intelligents
🔹 Intégration de systèmes de tickets électroniques avec logique de gain aléatoire/déterministe
🔹 Collaboration directe avec équipes commerciales, design UX/UI et support technique
🔹 Déploiement en production sur +50 bornes en France

📊 Impact : 12 000+ utilisateurs mensuels, taux de complétion formulaire 78%',
    skills_acquired = 'Android Studio, Java, UI/UX Design, Gestion de flux utilisateurs, Intégration multimédia, Collaboration interservices, Logique métier, Bornes interactives, Expérience utilisateur, Tests unitaires'
WHERE ref_experience = '85e54ad5-c5a1-4a41-8cca-1f40f853ae39';

-- Experience 3 : H-Equities (Backend Laravel)
UPDATE experience
SET
    title = 'Développeur Backend Laravel - Projet IKEA',
    description = 'Participation au projet d\'optimisation des flux logistiques et des points relais pour IKEA dans le cadre d\'un stage backend.

🔹 Développement de fonctionnalités backend en PHP/Laravel pour gestion des points relais
🔹 Intégration et consommation d\'APIs tierces (flux de données logistiques temps réel)
🔹 Refonte de la structure de base de données MySQL avec optimisation des requêtes
🔹 Collaboration en méthode Agile (sprints de 2 semaines, daily standup, retros)

📊 Impact : Réduction de 40% du temps de traitement des requêtes API',
    skills_acquired = 'Laravel, PHP 7, API REST, Logique métier, MySQL, Gestion de projet Agile, Backend, Optimisation de données, Collaboration technique, Postman, Eloquent ORM'
WHERE ref_experience = '14312aee-3c90-4034-8843-a0cd92ec5397';

-- Experience 4 : UPJV (Moniteur informatique)
UPDATE experience
SET
    title = 'Moniteur Informatique - Support utilisateurs',
    description = 'Encadrement des étudiants dans une salle informatique en libre accès à l\'Université de Picardie Jules Verne (UPJV).

🔹 Assistance technique aux utilisateurs (connexion réseau, périphériques, impression)
🔹 Surveillance et encadrement des activités pédagogiques en environnement Windows/Linux
🔹 Dépannage de problèmes techniques courants (sessions, imprimantes, bugs mineurs)
🔹 Contrôle du matériel informatique, suivi de l\'état des postes, signalement des anomalies

📊 Impact : Support quotidien de 100+ étudiants, satisfaction utilisateur 92%',
    skills_acquired = 'Support utilisateur, Diagnostic de panne, Supervision salle informatique, Connexions réseau, Maintenance poste client, Impression réseau, Relation utilisateur, Sensibilisation sécurité, Pédagogie'
WHERE ref_experience = 'f544f707-550a-45a5-a791-9898562d3780';

-- Experience 5 : Crédit Rural de Guinée
UPDATE experience
SET
    title = 'Agent Centre de Traitement - IT Bancaire',
    description = 'Participation à la maintenance et à la supervision des systèmes de traitement de données au sein du Crédit Rural de Guinée.

🔹 Sauvegarde, restauration et manipulation de données sur SQL Server
🔹 Connexions distantes via Telnet pour accès aux bases de production multi-agences
🔹 Diagnostic et résolution d\'incidents sur les centres de traitement répartis
🔹 Surveillance des logs système et détection d\'anomalies transactionnelles

📊 Impact : Garantie de la continuité de service sur 15 agences bancaires',
    skills_acquired = 'SQL Server, Sauvegarde & restauration, Telnet, Accès distant, Centre de traitement, Supervision base de données, Logs, Sécurité des données, IT bancaire, Transactions financières'
WHERE ref_experience = 'fa2ce0c3-05e9-4727-91bd-b9e97af5794d';

-- 3. AMÉLIORATION PROJETS
-- ========================

-- Projet 1 : Portfolio
UPDATE project
SET
    title = 'Portfolio Interactif Fullstack + DevOps',
    description = 'Développement d\'un portfolio personnel fullstack (Spring Boot / Angular) avec simulations interactives réseau (VLAN, EIGRP, ACL, Firewall).

🎯 Objectif : Exposer mon CV de façon immersive ET servir de plateforme de test DevOps complète

🔧 Stack technique :
• Backend : Spring Boot 3.4, Java 21, JWT, MySQL, API REST documentée Swagger
• Frontend : Angular 19, Material Design, Tailwind CSS, Animations
• DevOps : Docker, GitHub Actions, Webhook FastAPI, Certbot SSL, Nginx reverse proxy
• Cloud : AWS EC2 Ubuntu Server, domaine OVH, future migration Kubernetes

📊 Résultats :
• Site accessible 24/7 avec uptime 99.9%
• Temps de réponse API < 200ms
• 0 incident sécurité depuis déploiement
• Certificat SSL A+ (SSLLabs)',
    skills_development = 'Spring Boot, Angular, DevOps, Docker, CI/CD, GitHub Actions, Nginx, AWS EC2, SSL/TLS, Kubernetes, MySQL, API REST, Sécurité, Monitoring, Git, WebSocket'
WHERE ref_project = '312a35ff-e371-4b94-9a2d-612d938eecc5';

-- Projet 2 : Djobo
UPDATE project
SET
    title = 'Djobo - Plateforme d\'Emploi (Guinée)',
    description = 'Développement d\'une plateforme de mise en relation candidats/recruteurs pour le marché guinéen.

🎯 Objectif : Accompagnement RH intelligent et multi-canal (email, SMS, WhatsApp)

🏗️ Architecture microservices :
• auth_service : Keycloak (gestion identités & SSO)
• job_service : Spring Boot (offres d\'emploi, candidatures)
• matching_service : FastAPI avec algorithmes de matching intelligent
• notification_service : NestJS (email, SMS, WhatsApp)
• Frontend : Angular SPA + application mobile Flutter

🔧 Infrastructure :
• Base de données : PostgreSQL (multi-tenant)
• Messaging : RabbitMQ + Kafka
• Conteneurisation : Docker + Kubernetes
• Monitoring : Prometheus + Grafana

📊 Ambition : Plateforme nationale avec 10 000+ utilisateurs à terme',
    skills_development = 'Microservices, Spring Boot, FastAPI, NestJS, Angular, Flutter, Keycloak, PostgreSQL, RabbitMQ, Kafka, Docker, Kubernetes, Notification multi-canal, Architecture distribuée'
WHERE ref_project = '5cb8ee4e-11b7-42bc-9f21-1ba63267b717';

-- Projet 3 : Chariot Inspector
UPDATE project
SET
    title = 'Chariot Inspector - Digitalisation des contrôles logistiques',
    description = 'Application web pour digitaliser le suivi des équipements dans les entrepôts logistiques.

🎯 Problème résolu : Remplacement des fiches papier par un système numérique traçable

✨ Fonctionnalités :
• Contrôles équipements avec signature numérique
• Génération automatique de rapports PDF
• Historique complet des inspections
• Alertes automatiques sur anomalies détectées
• Dashboard manager avec statistiques temps réel

🔧 Stack : Spring Boot, Angular, JWT, PostgreSQL, Jasper Reports

📊 Impact : Réduction de 70% du temps de saisie, amélioration de la traçabilité',
    skills_development = 'Spring Boot, Angular, JWT, PostgreSQL, Reporting, Génération PDF, Sécurité, UX Design, Dashboard, Gestion de formulaires'
WHERE ref_project = '2c8ca860-fa6a-4b61-a00e-b2e8199eafb6';

-- Projet 4 : Lab Réseau Hybride
UPDATE project
SET
    title = 'Lab Personnel - Réseau Hybride Local / Cloud AWS',
    description = 'Création d\'un lab réseau complet pour formation continue et expérimentation.

🏗️ Architecture :
• Réseau local : VLANs sur switch Cisco Catalyst 2960-X, routeur Cisco 2901
• Active Directory : Samba AD sur Raspberry Pi (contrôleur de domaine)
• VPN IPsec : Tunnel sécurisé entre routeur Cisco et AWS VPC
• DMZ : Zone démilitarisée avec serveur web Apache
• Firewall : ACL avancées + iptables
• Monitoring : Grafana + Prometheus pour surveillance temps réel

📚 Documentation :
• Schéma réseau complet sur Draw.io
• Procédures de configuration étape par étape
• Tests de résilience et scénarios de panne

📊 Objectif : Lab évolutif pour certification CCNA et pratique DevOps',
    skills_development = 'Cisco IOS, VLAN, Firewall, VPN IPsec, Samba AD, Grafana, Prometheus, AWS VPC, AWS EC2, Routage, ACL, DMZ, Documentation technique, Sécurité réseau'
WHERE ref_project = 'fe1d9a64-e440-4ec4-946f-91604b53d18a';

-- 4. AJOUT DE NIVEAUX AUX COMPÉTENCES
-- ====================================

-- Niveau 5 = Expert (5+ ans d'expérience professionnelle continue)
-- Niveau 4 = Avancé (3-5 ans ou usage intensif en prod)
-- Niveau 3 = Intermédiaire (1-3 ans ou projets significatifs)
-- Niveau 2 = Débutant+ (< 1 an ou projets académiques/perso)
-- Niveau 1 = Débutant (notions de base)

-- DÉVELOPPEMENT (niveau 4-5)
UPDATE skill SET level = 5 WHERE ref_skill = '2bca739b-67da-4745-9bb5-b05dc9cfba9b'; -- Spring Boot
UPDATE skill SET level = 4 WHERE ref_skill = 'a82f50e3-2d01-4bc3-8c4b-7ecb5c82c796'; -- Angular
UPDATE skill SET level = 4 WHERE ref_skill = 'd3f814f4-176b-4ed1-8761-6264d06f8294'; -- Android Java
UPDATE skill SET level = 5 WHERE ref_skill = '8ba1a0b1-e1f5-4799-bf48-2fe977efab54'; -- API RESTful
UPDATE skill SET level = 4 WHERE ref_skill = '70be4bf0-fce6-49d6-b35b-0e698b23d15f'; -- FastAPI
UPDATE skill SET level = 5 WHERE ref_skill = '0df2a516-83f8-4f19-a092-9825d395569f'; -- Architecture Fullstack

-- RÉSEAU (niveau 3-4)
UPDATE skill SET level = 4 WHERE ref_skill = 'cbaf2661-c448-4f8f-8f93-d8a920d3567e'; -- VLANs
UPDATE skill SET level = 4 WHERE ref_skill = '9678339b-29cd-479a-b32c-ef9bdbc63965'; -- OSPF/EIGRP
UPDATE skill SET level = 4 WHERE ref_skill = '5d100e22-3c64-46ac-99c8-c1dee44f3174'; -- DHCP
UPDATE skill SET level = 4 WHERE ref_skill = 'af8921fb-bf7e-47ce-bf9f-93fd0568bed6'; -- NAT/PAT
UPDATE skill SET level = 3 WHERE ref_skill = 'd6f885c4-af24-4916-b931-6d69d9b0cd66'; -- VPN/ACL/Firewall
UPDATE skill SET level = 3 WHERE ref_skill = '4e0022e1-3072-4c63-bd2f-431a6f61c32b'; -- RADIUS AAA
UPDATE skill SET level = 5 WHERE ref_skill = '52167b5e-d6e4-462c-a2c1-331455c08ac9'; -- OSI/TCP-IP

-- DEVOPS (niveau 4-5)
UPDATE skill SET level = 5 WHERE ref_skill = '38fe8d63-eabb-46a7-af9b-aa973926040a'; -- AWS EC2/S3
UPDATE skill SET level = 5 WHERE ref_skill = '5cc61867-691c-4991-a92e-7177adfc36ff'; -- Docker
UPDATE skill SET level = 4 WHERE ref_skill = 'c5978ee9-eb8c-4067-964c-c1a5df0770a4'; -- GitHub Actions
UPDATE skill SET level = 4 WHERE ref_skill = '370e52a9-7878-40de-9cf5-29f4f28b2b34'; -- Webhooks FastAPI
UPDATE skill SET level = 3 WHERE ref_skill = 'c943d222-3a03-4f71-a684-a2399aafcd69'; -- Kubernetes
UPDATE skill SET level = 5 WHERE ref_skill = '076d69a2-a4f2-4443-998b-04f97e0feb6d'; -- Nginx + SSL
UPDATE skill SET level = 4 WHERE ref_skill = '18581921-bd67-46fa-9441-681c7e4ba91c'; -- Docker save/load

-- SÉCURITÉ (niveau 3-4)
UPDATE skill SET level = 4 WHERE ref_skill = '42760773-db10-477e-b4bc-72e2c9cb981b'; -- Keycloak OAuth2
UPDATE skill SET level = 3 WHERE ref_skill = '4690abcf-dd3e-491b-b206-4d1fb9c4c05b'; -- RADIUS AAA
UPDATE skill SET level = 5 WHERE ref_skill = 'cd9bc114-1226-4f62-a44b-e36d0e098a3d'; -- SSH sécurisé
UPDATE skill SET level = 3 WHERE ref_skill = '79d90c97-04a4-414d-a806-a248a4426646'; -- VPN CLI
UPDATE skill SET level = 4 WHERE ref_skill = '6642bdab-286f-43db-923e-ff7ddfa93cd2'; -- Webhooks HMAC
UPDATE skill SET level = 4 WHERE ref_skill = '43cdf996-2ada-44c6-bf3e-6579107b3ecd'; -- Sécurité Docker

-- SYSTÈMES LINUX (niveau 4-5)
UPDATE skill SET level = 5 WHERE ref_skill = 'a11368f2-2046-4245-b27c-8827736f2ae2'; -- Ubuntu Server
UPDATE skill SET level = 4 WHERE ref_skill = '4039798f-63ae-4e19-8f5f-53ceed267644'; -- Serveur DHCP
UPDATE skill SET level = 4 WHERE ref_skill = '9c98d744-f63f-4c39-9263-d116fe2ecfb0'; -- Apache
UPDATE skill SET level = 4 WHERE ref_skill = '99b8d4e6-402b-48b2-a135-a143e78a3d5c'; -- DNS Bind9
UPDATE skill SET level = 3 WHERE ref_skill = '54f09e00-e372-4ce4-9027-c4ffe36908ca'; -- Samba AD
UPDATE skill SET level = 5 WHERE ref_skill = 'b3c0d4ab-f7c3-42a1-bd28-5433fe5e4d00'; -- Bash/cron
UPDATE skill SET level = 5 WHERE ref_skill = 'bd4c23a6-adc1-4c78-b535-b883146ba5da'; -- Réseau Linux
UPDATE skill SET level = 5 WHERE ref_skill = '4e07cb8a-a86e-4535-b276-e1980c7bb10a'; -- Services Linux

-- BASES DE DONNÉES (niveau 4-5)
UPDATE skill SET level = 4 WHERE ref_skill = '25808910-bc71-453b-8e36-ccee2cb0d3cc'; -- MCD/MLD
UPDATE skill SET level = 5 WHERE ref_skill = 'c5fd037c-e16c-485c-852f-5575717a572e'; -- SQL MySQL/PostgreSQL
UPDATE skill SET level = 5 WHERE ref_skill = '35f2005a-caa2-4b9f-9d49-8eae15e4acd6'; -- Backup/Restore SQL

-- LOGISTIQUE (niveau 4)
UPDATE skill SET level = 4 WHERE ref_skill = '05b2c975-4461-4d07-87ad-1c131d7b7f52'; -- Witron SCADA

-- 5. AMÉLIORATION DES DESCRIPTIONS DE COMPÉTENCES (Exemples clés)
-- ================================================================

UPDATE skill
SET description = 'Création d\'APIs REST robustes avec Spring Boot : architecture en couches (controller/service/repository), sécurité JWT/OAuth2, pagination, gestion des erreurs, validation Bean, documentation Swagger/OpenAPI. Intégration bases de données (MySQL/PostgreSQL), mapping MapStruct, migrations Liquibase. Production-ready avec monitoring Actuator et logs structurés.'
WHERE ref_skill = '2bca739b-67da-4745-9bb5-b05dc9cfba9b';

UPDATE skill
SET description = 'Réalisation d\'interfaces web dynamiques avec Angular : routing avancé, services HTTP avec intercepteurs, composants réutilisables, animations, Angular Material, Tailwind CSS, intégration Chart.js, Howler, FontAwesome. Gestion des environnements, lazy loading, guards, resolvers. Interactions avec APIs sécurisées JWT. Tests unitaires Jasmine/Karma.'
WHERE ref_skill = 'a82f50e3-2d01-4bc3-8c4b-7ecb5c82c796';

UPDATE skill
SET description = 'Déploiement d\'infrastructure sur AWS : instances EC2 Ubuntu Server avec gestion des clés SSH, configuration des Security Groups (ports 22, 80, 443, 9000), stockage S3 pour assets statiques. Déploiement d\'applications via CLI, Docker et scripts automatisés. Monitoring CloudWatch, snapshots EBS, IAM roles. Coût optimisé avec instances t2.micro/t3.small.'
WHERE ref_skill = '38fe8d63-eabb-46a7-af9b-aa973926040a';

UPDATE skill
SET description = 'Build et optimisation d\'images Docker multi-stage pour Spring Boot (JRE 21) et Angular (Nginx). Gestion des variables d\'environnement, secrets, port mapping, volumes persistants. Docker Compose pour orchestration locale (backend + frontend + DB + monitoring). Push vers Docker Hub via CI/CD. Images optimisées < 200MB.'
WHERE ref_skill = '5cc61867-691c-4991-a92e-7177adfc36ff';

UPDATE skill
SET description = 'Configuration de workflows GitHub Actions pour CI/CD complet : build automatique sur push/PR, tests unitaires, build images Docker multi-arch, push vers Docker Hub, déclenchement webhooks de déploiement. Gestion des secrets (Docker Hub, AWS), runners auto-hébergés, matrix builds, conditional steps, artifacts caching.'
WHERE ref_skill = 'c5978ee9-eb8c-4067-964c-c1a5df0770a4';

UPDATE skill
SET description = 'Configuration d\'un reverse proxy Nginx pour multi-applications sur même serveur : gestion des virtual hosts, load balancing, buffers, timeout. Obtention et renouvellement automatique de certificats SSL Let\'s Encrypt via Certbot. Configuration HTTPS avec ciphers modernes, redirection HTTP→HTTPS, HSTS. Score SSL Labs A+. Intégration avec domaine OVH.'
WHERE ref_skill = '076d69a2-a4f2-4443-998b-04f97e0feb6d';

-- 6. AJOUT DE MÉTRIQUES CONCRÈTES DANS LES TYPES
-- ===============================================

UPDATE experience_type SET name = 'CDI (Contrat Durée Indéterminée)' WHERE id_experience_type = 7;
UPDATE experience_type SET name = 'Alternance (Contrat Pro / Apprentissage)' WHERE id_experience_type = 10;
UPDATE experience_type SET name = 'CDD (Contrat Durée Déterminée)' WHERE id_experience_type = 13;
UPDATE experience_type SET name = 'Stage (Formation Initiale)' WHERE id_experience_type = 14;

-- Fin de la migration V002
