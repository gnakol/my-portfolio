-- MySQL dump 10.13  Distrib 9.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: portfolio_db
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id_account` int NOT NULL AUTO_INCREMENT,
  `ref_account` varchar(100) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(300) DEFAULT NULL,
  `phone_number` int DEFAULT NULL,
  `civility` varchar(50) DEFAULT NULL,
  `github` varchar(50) DEFAULT NULL,
  `linkedin` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `cv_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_account`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (9,'bd908476-7323-4ebd-b1f6-df26770554fd','support-portfolio','admin-support','support-admin@portfolio.fr','$2a$10$6jYXVAw5EbJhz3CnIau05OhoGUP.CP9FuP0U3CT7BesERnbiOThkO',655714500,'MR','gnakol','gna.pro','10 rue utrillo Arras','https://kolie-portfolio-profile.s3.eu-north-1.amazonaws.com/avatars/08a5f1f7-bdf3-40c6-bce6-f0c6ee4d52e1-profile.png','https://kolie-portfolio-profile.s3.eu-north-1.amazonaws.com/cv/fac01a32-c544-44fb-9619-978a152c1d58-cv.pdf'),(10,'52e1ebb0-ad0e-4828-916a-180892680376','dannie','danni','dannie@djobo.fr','$2a$10$V1SE0umXAZUhMJ2Rva6pyeE9yenA6sYYA1iOBoUUD99CfIt1G4feC',655714500,'MR','gnakol','gna.pro','10 rue utrillo Arras',NULL,NULL);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `id_article` int NOT NULL AUTO_INCREMENT,
  `ref_article` varchar(100) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `publication_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_account` int NOT NULL,
  PRIMARY KEY (`id_article`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `article_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article_tag`
--

DROP TABLE IF EXISTS `article_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_tag` (
  `id_article` int NOT NULL,
  `id_tag` int NOT NULL,
  PRIMARY KEY (`id_article`,`id_tag`),
  KEY `id_tag` (`id_tag`),
  CONSTRAINT `article_tag_ibfk_1` FOREIGN KEY (`id_article`) REFERENCES `article` (`id_article`) ON DELETE CASCADE,
  CONSTRAINT `article_tag_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tag` (`id_tag`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_tag`
--

LOCK TABLES `article_tag` WRITE;
/*!40000 ALTER TABLE `article_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id_comment` int NOT NULL AUTO_INCREMENT,
  `ref_comment` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `date_comment` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_article` int NOT NULL,
  `id_account` int NOT NULL,
  PRIMARY KEY (`id_comment`),
  KEY `id_article` (`id_article`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`id_article`) REFERENCES `article` (`id_article`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_network`
--

DROP TABLE IF EXISTS `configuration_network`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_network` (
  `id_configuration` int NOT NULL AUTO_INCREMENT,
  `ref_configuration` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `json_content` json DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_account` int NOT NULL,
  PRIMARY KEY (`id_configuration`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `configuration_network_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_network`
--

LOCK TABLES `configuration_network` WRITE;
/*!40000 ALTER TABLE `configuration_network` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuration_network` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id_contact` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `message` varchar(500) NOT NULL,
  PRIMARY KEY (`id_contact`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establishment`
--

DROP TABLE IF EXISTS `establishment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establishment` (
  `id_establishment` int NOT NULL AUTO_INCREMENT,
  `ref_establishment` varchar(100) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_establishment`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establishment`
--

LOCK TABLES `establishment` WRITE;
/*!40000 ALTER TABLE `establishment` DISABLE KEYS */;
INSERT INTO `establishment` VALUES (1,'22618e06-b2f3-4c73-9fad-0671161ddf99','EPSI','Arras'),(2,'18729af3-f0d4-4403-80ee-54bbf46bcef9','Universite Picardie Jules Verne','Amiens'),(4,'ab99095b-4b03-47fd-8ce8-4084d0664675','INCUBATEUR EURATECH','LILLE'),(8,'2d6ad9f3-349a-418d-a400-7884deb8c48e','ASTON','LILLE');
/*!40000 ALTER TABLE `establishment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience` (
  `id_experience` int NOT NULL AUTO_INCREMENT,
  `ref_experience` varchar(100) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `id_experience_type` int NOT NULL,
  `id_account` int NOT NULL,
  `skills_acquired` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id_experience`),
  KEY `id_experience_type` (`id_experience_type`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `experience_ibfk_1` FOREIGN KEY (`id_experience_type`) REFERENCES `experience_type` (`id_experience_type`) ON DELETE CASCADE,
  CONSTRAINT `experience_ibfk_2` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience`
--

LOCK TABLES `experience` WRITE;
/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
INSERT INTO `experience` VALUES (27,'94581afa-4f99-48ef-a240-a8f7eb0e2af9','Intralogistique & supervision système','Interventions techniques dans un environnement hautement automatisé basé sur la technologie allemande Witron, en tant que référent opérationnel des flux logistiques informatisés.\nSurveillance en temps réel des modules critiques (DPAL, COM, OPM, HBW) via un système centralisé SCADA.\nLecture, analyse et interprétation de rapports système automatisés pour détecter les anomalies et y répondre rapidement.\nExécution de procédures techniques sur lignes robotisées avec intervention sur interfaces HMI, tableaux de bord système et capteurs.','2025-06-19','2025-01-20','Scapartois',7,9,'Surveillance systèmes, Analyse de logs, Alerting, Diagnostic système, Automatisation, Système SCADA, Monitoring, Capteurs intelligents, Environnement critique'),(28,'85e54ad5-c5a1-4a41-8cca-1f40f853ae39','Développeur Android - Bornes interactives et UX en point de vente','Développement et déploiement d’applications Android sur bornes interactives en grandes surfaces (Auchan, Carrefour, etc.), en intégrant des parcours clients fluides et immersifs :\nConception de formulaires intelligents pour inscriptions et enregistrement d’informations utilisateurs.\nIntégration de systèmes de tickets électroniques avec logique de gain aléatoire ou déterministe.\nCollaboration directe avec les équipes commerciales, design UX/UI et support technique pour livrer des solutions clé-en-main.','2022-10-22','2023-12-30','Arsenal Borne',10,9,'Développement mobile Android, UI/UX, Gestion de flux utilisateurs, Intégration multimédia, Collaboration inter-équipes, Logique métier, Android studio Java, Bornes interactives, Expérience utilisateur'),(30,'14312aee-3c90-4034-8843-a0cd92ec5397','Développeur Backend Laravel','Participation à un projet d’optimisation des flux logistiques et des points relais pour IKEA, dans le cadre d’un stage de développement backend avec Laravel :\nDéveloppement de fonctionnalités backend en PHP/Laravel liées à la gestion des points relais.\nIntégration et consommation d’API tierces (flux de données logistiques).\nRefonte de certaines parties de la structure de base de données MySQL.\n','2020-01-13','2020-04-21','H-Equities',14,9,'Laravel, PHP, API REST, Logique métier, MySQL, Gestion de projet Agile, Backend, Optimisation de données, Collaboration technique, Postman'),(31,'f544f707-550a-45a5-a791-9898562d3780','Moniteur informatique - Support utilisateurs','Encadrement des étudiants dans une salle informatique en libre accès à l’Université de Picardie Jules Verne (UPJV) :\nAssistance technique aux utilisateurs : connexion réseau, périphériques, impression.\nSurveillance et encadrement des activités pédagogiques en environnement Windows/Linux.\nDépannage de problèmes techniques courants (sessions, imprimantes, bugs mineurs).\nContrôle du matériel informatique, suivi de l\'état des postes, signalement des anomalies.','2019-01-10','2020-12-25','Université de Picardie Jules Verne (UPJV)',13,9,'Support utilisateur, Diagnostic de panne, Supervision salle informatique, Connexions réseau, Maintenance poste client, Impression réseau, Relation utilisateur, Sensibilisation sécurité'),(32,'fa2ce0c3-05e9-4727-91bd-b9e97af5794d','Agent Centre de Traitement','Participation à la maintenance et à la supervision des systèmes de traitement de données au sein du Crédit Rural de Guinée, avec une forte orientation bases de données et interventions réseau distantes :\nSauvegarde, restauration et manipulation de données sur SQL Server.\nConnexions distantes via Telnet pour accès aux bases de production.\nDiagnostic et résolution d\'incidents sur les centres de traitement répartis sur plusieurs agences.\n','2015-01-05','2016-07-30','Crédit Rural de Guinée',13,9,'SQL Server, Sauvegarde & restauration, Telnet, Accès distant, Centre de traitement, Supervision base de données, Logs, Sécurité des données, IT bancaire');
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience_type`
--

DROP TABLE IF EXISTS `experience_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience_type` (
  `id_experience_type` int NOT NULL AUTO_INCREMENT,
  `ref_experience_type` varchar(100) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_experience_type`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience_type`
--

LOCK TABLES `experience_type` WRITE;
/*!40000 ALTER TABLE `experience_type` DISABLE KEYS */;
INSERT INTO `experience_type` VALUES (7,'c2356c4b-2415-400d-a38c-2f1d3a0997f6','CDI'),(10,'016093f7-4e79-4281-af72-b40d66dab9d4','Alternance'),(13,'7b2f4c5f-416f-43cd-b519-13c0b8518f23','CDD'),(14,'b26f8d7a-0601-4331-bf5c-fa1cfde2e64b','Stage');
/*!40000 ALTER TABLE `experience_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `experience_name` varchar(255) NOT NULL,
  `feedback_type` varchar(50) NOT NULL,
  `feedback_value` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,'Configuration VLAN','emoji','positive','2025-03-10 12:56:25'),(2,'Configuration VLAN','emoji','negative','2025-03-10 14:35:42');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hobbies`
--

DROP TABLE IF EXISTS `hobbies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hobbies` (
  `id_hobby` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `id_account` int DEFAULT NULL,
  `ref_hobby` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_hobby`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `hobbies_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hobbies`
--

LOCK TABLES `hobbies` WRITE;
/*!40000 ALTER TABLE `hobbies` DISABLE KEYS */;
INSERT INTO `hobbies` VALUES (13,'Hip-Hop (freestyle & chorégraphie)','J’apprécie autant le travail d’équipe dans les chorégraphies que l’intensité des battles. Cela m’a appris à improviser, à m’adapter rapidement et à relever des défis avec créativité — des qualités que j’applique aussi dans ma façon de coder et résoudre des problèmes IT.',9,'55f5fdf1-ae93-4f3f-8fb2-44d45d8fe2f9'),(14,'Spectacles d’humour & culture stand-up française','Grand amateur de spectacles humoristiques et de stand-up, j’aime observer comment les artistes captivent un public par la précision, le rythme et l’authenticité. Cela m’a enseigné l’importance de la clarté, de l’écoute et du storytelling — utiles dans la communication technique et la collaboration en équipe IT.',9,'a074dc73-71be-4b82-a6a2-c0df39a10eec'),(15,'Gymnastique & disciplines acrobatiques','Je pratique la gymnastique (salto, barres, anneaux), un sport exigeant qui m’a forgé en persévérance, rigueur et dépassement de soi. Des qualités clés dans l’univers de l’informatique, notamment lors de la résolution de bugs ou l’apprentissage de nouvelles technologies.',9,'a302f249-d176-4ea1-8163-70801302d571');
/*!40000 ALTER TABLE `hobbies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `language` (
  `id_language` int NOT NULL AUTO_INCREMENT,
  `ref_language` varchar(100) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `proficiency_level` varchar(50) DEFAULT NULL,
  `id_account` int DEFAULT NULL,
  PRIMARY KEY (`id_language`),
  KEY `fk_language_account` (`id_account`),
  CONSTRAINT `fk_language_account` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES (5,'e8c1b538-bb67-44e3-9fa4-c24743332551','Français','Courant',NULL),(6,'473ef523-db7b-48d6-99ff-a80e237b9330','Anglais','Intermédiaire',9);
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_security`
--

DROP TABLE IF EXISTS `log_security`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_security` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `type_log` enum('ALERTE','EVENEMENT','FAILLE') NOT NULL,
  `message` text NOT NULL,
  `date_log` datetime DEFAULT CURRENT_TIMESTAMP,
  `ip_source` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_log`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_security`
--

LOCK TABLES `log_security` WRITE;
/*!40000 ALTER TABLE `log_security` DISABLE KEYS */;
INSERT INTO `log_security` VALUES (61,'EVENEMENT','Ping executed to IP: google.com',NULL,'google.com'),(62,'EVENEMENT','VLAN configuré : ID=10, Nom=VLAN-IT','2025-03-12 16:09:37','localhost'),(63,'EVENEMENT','Ping executed to IP: -c 4 google.com',NULL,'-c 4 google.com'),(64,'EVENEMENT','Ping executed to IP: google.com',NULL,'google.com');
/*!40000 ALTER TABLE `log_security` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id_permission` int NOT NULL AUTO_INCREMENT,
  `name_permission` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_permission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id_project` int NOT NULL AUTO_INCREMENT,
  `ref_project` varchar(100) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `skills_development` text,
  `id_project_type` int NOT NULL,
  `id_account` int NOT NULL,
  PRIMARY KEY (`id_project`),
  KEY `id_project_type` (`id_project_type`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`id_project_type`) REFERENCES `project_type` (`id_project_type`) ON DELETE CASCADE,
  CONSTRAINT `project_ibfk_2` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (6,'312a35ff-e371-4b94-9a2d-612d938eecc5','Portfolio interactif','Développement d’un portfolio personnel fullstack Spring Boot / Angular avec simulations interactives réseau (VLAN, EIGRP, ACL, etc.). Ce projet expose mon CV de façon immersive et interactive. Il me sert également de plateforme de test DevOps : build docker, GitHub Actions, déploiement via webhook FastAPI, certificat SSL avec Certbot, reverse proxy Nginx, nom de domaine OVH et Kubernetes. Projet déployé sur AWS EC2 Ubuntu Server.\'','2025-01-27','2025-02-20','Développement d’un portfolio personnel fullstack Spring Boot / Angular avec simulations interactives réseau (VLAN, EIGRP, ACL, etc.). Ce projet expose mon CV de façon immersive et interactive. Il me sert également de plateforme de test DevOps : build docker, GitHub Actions, déploiement via webhook FastAPI, certificat SSL avec Certbot, reverse proxy Nginx, nom de domaine OVH et Kubernetes. Projet déployé sur AWS EC2 Ubuntu Server.',8,9),(7,'5cb8ee4e-11b7-42bc-9f21-1ba63267b717','Djobo','Djobo - Plateforme d’emploi (Guinée),\nDéveloppement d’une plateforme de mise en relation candidats/recruteurs pour la Guinée. Architecture microservices avec : auth_service (Keycloak), job_service (Spring Boot), matching_service (FastAPI avec algorithmes), notification_service (NestJS), avec frontend Angular et appli mobile Flutter. Projet long terme avec ambition nationale, visant un accompagnement RH intelligent et multi-canal (email, SMS, WhatsApp).','2024-11-20','2026-12-31','Spring Boot, FastAPI, NestJS, Microservices, Keycloak, Angular, PostgreSQL, RabbitMQ, Docker, Flutter, Notification multi-canal, Kafka.',7,9),(8,'2c8ca860-fa6a-4b61-a00e-b2e8199eafb6',' Chariot Inspector','Application web pour digitaliser le suivi des équipements dans les entrepôts logistiques.\nLes ouvriers peuvent effectuer des contrôles, signer numériquement et générer automatiquement des rapports.\nL’application remplace les anciennes fiches papier et améliore la traçabilité.','2024-08-07','2024-10-30','Spring Boot, Angular, JWT, PostgreSQL, Reporting, Sécurité, UX Design',3,9),(9,'fe1d9a64-e440-4ec4-946f-91604b53d18a','Lab personnel – Réseau hybride local / Cloud AWS','Création d’un lab réseau complet avec VLANs, Active Directory sur Raspberry Pi, VPN IPsec entre un routeur Cisco et AWS, DMZ, firewall, monitoring Grafana/Prometheus, segmentation réseau et documentation complète sur Draw.io.','2025-04-16','2025-08-31','Cisco, VLAN, Firewall, VPN IPsec, Samba AD, Grafana, Prometheus, AWS VPC, EC2, Routage, Documentation.',4,9);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_type`
--

DROP TABLE IF EXISTS `project_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_type` (
  `id_project_type` int NOT NULL AUTO_INCREMENT,
  `ref_project_type` varchar(100) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_project_type`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_type`
--

LOCK TABLES `project_type` WRITE;
/*!40000 ALTER TABLE `project_type` DISABLE KEYS */;
INSERT INTO `project_type` VALUES (3,'cdb808af-f485-43dd-bca4-603b72a69cd4','Développement Fullstack'),(4,'ce2560e3-01f0-45a5-90b4-f8a41d74b030','Infrastructure & Réseaux'),(5,'ff0de41d-eb4a-45fa-863a-9a55ccd40661','Administration Système Linux'),(6,'f78d47e4-a1cb-497d-8ce3-8475ea63173c','Projet de reconversion & montée en compétences'),(7,'f5130845-2e75-48d0-8c3f-16b74f339d36','Projet en cours & longue durée'),(8,'fc1d9218-f1f2-455d-830b-84a47d69b0a4','Portfolio personnel & démonstratif');
/*!40000 ALTER TABLE `project_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `ref_role` varchar(100) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'4d266d96-56f4-407d-a585-ce679acd358f','ADMIN'),(2,'b0f8813b-c663-481a-b596-49077fbd6450','VISITOR');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_account`
--

DROP TABLE IF EXISTS `role_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_account` (
  `id_account` int NOT NULL,
  `id_role` int NOT NULL,
  PRIMARY KEY (`id_account`,`id_role`),
  KEY `id_role` (`id_role`),
  CONSTRAINT `role_account_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`),
  CONSTRAINT `role_account_ibfk_2` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_account`
--

LOCK TABLES `role_account` WRITE;
/*!40000 ALTER TABLE `role_account` DISABLE KEYS */;
INSERT INTO `role_account` VALUES (9,1),(10,2);
/*!40000 ALTER TABLE `role_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `id_role` int NOT NULL,
  `id_permission` int NOT NULL,
  PRIMARY KEY (`id_role`,`id_permission`),
  KEY `id_permission` (`id_permission`),
  CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`),
  CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`id_permission`) REFERENCES `permission` (`id_permission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simulation`
--

DROP TABLE IF EXISTS `simulation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simulation` (
  `id_simulation` int NOT NULL AUTO_INCREMENT,
  `ref_simulation` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `command_test` text NOT NULL,
  `expected_result` text NOT NULL,
  `id_skill` int NOT NULL,
  PRIMARY KEY (`id_simulation`),
  KEY `id_skill` (`id_skill`),
  CONSTRAINT `simulation_ibfk_1` FOREIGN KEY (`id_skill`) REFERENCES `skill` (`id_skill`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simulation`
--

LOCK TABLES `simulation` WRITE;
/*!40000 ALTER TABLE `simulation` DISABLE KEYS */;
/*!40000 ALTER TABLE `simulation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill` (
  `id_skill` int NOT NULL AUTO_INCREMENT,
  `ref_skill` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `id_skill_category` int DEFAULT NULL,
  `id_account` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`id_skill`),
  KEY `id_skill_category` (`id_skill_category`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`id_skill_category`) REFERENCES `skill_category` (`id_skill_category`),
  CONSTRAINT `skill_ibfk_2` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
INSERT INTO `skill` VALUES (18,'05b2c975-4461-4d07-87ad-1c131d7b7f52','Supervision des systèmes automatisés (Witron)','Surveillance, diagnostic et optimisation des flux logistiques automatisés sous système Witron. Intervention en environnement industriel connecté avec résolution d’anomalies en temps réel sur les modules DPAL, COM, OPM, HBW.',4,9,NULL),(25,'2bca739b-67da-4745-9bb5-b05dc9cfba9b','Développement backend avec Spring Boot','Création d’API REST robustes avec Spring Boot : logique métier, sécurité, pagination, gestion des erreurs, validation, services RESTful documentés avec Swagger/OpenAPI. Intégration avec bases de données (MySQL/PostgreSQL), mapping avec MapStruct, et migrations via Liquibase.',3,9,NULL),(26,'a82f50e3-2d01-4bc3-8c4b-7ecb5c82c796','Développement frontend avec Angular','Réalisation d’interfaces web dynamiques avec Angular : routing, services HTTP, composants personnalisés, animations, Angular Material, Tailwind CSS, intégration de bibliothèques comme Chart.js, Howler, FontAwesome. Gestion des environments, lazy loading et interactions avec des APIs sécurisées.',3,9,NULL),(27,'d3f814f4-176b-4ed1-8761-6264d06f8294','Développement mobile Android (Java)','Conception d’applications mobiles sous Android Studio, intégrant : formulaires dynamiques, animations, gestion de tickets, logique métier aléatoire/pré-définie, persistance de données, composants personnalisés, interactions avec API externes. Design UI sur mesure.',3,9,NULL),(28,'8ba1a0b1-e1f5-4799-bf48-2fe977efab54','Création d’API RESTful','Conception et déploiement d’API RESTful avec gestion des routes, des verbes HTTP, validation, sécurité, authentification JWT/OAuth2. Capacité à documenter et tester les APIs avec Swagger ou Postman',3,9,NULL),(29,'70be4bf0-fce6-49d6-b35b-0e698b23d15f','Développement microservice avec FastAPI','Utilisation de FastAPI pour créer des microservices légers, réactifs et scalables (ex : récepteurs webhook déployés sur AWS EC2 pour exécution de scripts shell automatisés). Intégration avec PostgreSQL, Pydantic pour validation, et Alembic pour migrations.',3,9,NULL),(30,'0df2a516-83f8-4f19-a092-9825d395569f','Architecture Fullstack Java / Angular','Mise en place d’architectures fullstack professionnelles avec Spring Boot en backend et Angular en frontend, sécurisées, conteneurisées avec Docker, et communiquant via API REST. Structuration modulaire du code et séparation des responsabilités.',3,9,NULL),(31,'cbaf2661-c448-4f8f-8f93-d8a920d3567e','Configuration de VLANs et routage inter-VLAN','Création et gestion de VLANs sur switchs Cisco Catalyst 2960-X et simulation Packet Tracer. Routage inter-VLAN avec routeurs Cisco 2901, configuration de trunks, VLAN natif, et segmentation réseau.',5,9,NULL),(32,'9678339b-29cd-479a-b32c-ef9bdbc63965','Protocoles de routage : OSPF & EIGRP','Mise en œuvre de protocoles de routage dynamique (OSPF, EIGRP) avec priorités, zone, ID de routeur, redistribution de routes. Comparaison des métriques, convergence réseau, tests de résilience sur pannes.',5,9,NULL),(33,'5d100e22-3c64-46ac-99c8-c1dee44f3174','Gestion complète de DHCP (avec ou sans serveur)','Configuration d’un service DHCP complet sur routeur Cisco, réservation d’adresses, durée des baux, utilisation de DHCP Relay (ip helper-address) dans des environnements VLANisés.',5,9,NULL),(34,'af8921fb-bf7e-47ce-bf9f-93fd0568bed6','NAT, PAT et translation d’adresses','Mise en place de NAT statique, dynamique, PAT, test de connectivité inter-réseaux avec simulation d’accès Internet et équipements physiques (TP-Link AX55).',5,9,NULL),(35,'d6f885c4-af24-4916-b931-6d69d9b0cd66','Mise en œuvre de VPN, ACL et pare-feu','Test de tunnels VPN (CLI) entre sites, configuration d’ACL standard et étendues, filtrage IP/ports, intégration avec pare-feu matériel/virtuel. Simulation de DMZ sécurisées.',5,9,NULL),(36,'4e0022e1-3072-4c63-bd2f-431a6f61c32b','Authentification réseau AAA avec serveur RADIUS','Configuration d’un serveur RADIUS (via Raspberry Pi) et d’un système AAA sur équipements Cisco. Mise en place de la triple authentification (login, enable, exec), test d’accès à distance sécurisé.',5,9,NULL),(37,'52167b5e-d6e4-462c-a2c1-331455c08ac9','Maîtrise du modèle OSI, TCP/IP & adressage IP','Bonne compréhension des 7 couches du modèle OSI, comparaison avec TCP/IP, maîtrise du calcul d’adresses IP, subnetting, notation CIDR, masque inversé. Application concrète dans la segmentation réseau.',5,9,NULL),(38,'38fe8d63-eabb-46a7-af9b-aa973926040a','Déploiement cloud AWS avec EC2 & S3','Mise en place d’une infrastructure sur AWS avec EC2 Ubuntu Server, gestion des clés SSH, ouverture des ports (firewall), et intégration du stockage S3 pour les données statiques. Déploiement d’applications via ligne de commande et Docker.',8,9,NULL),(39,'5cc61867-691c-4991-a92e-7177adfc36ff','Conteneurisation d’applications Spring Boot & Angular','Build et optimisation d’images Docker pour backend Spring Boot et frontend Angular, gestion des variables d’environnement, port mapping, multi-stage builds, docker-compose et gestion des volumes réseaux/DB.',8,9,NULL),(40,'c5978ee9-eb8c-4067-964c-c1a5df0770a4','Automatisation CI/CD avec GitHub Actions','Configuration de workflows personnalisés GitHub Actions pour builder, tester et pusher des images Docker vers Docker Hub. Déclenchement via push/pull request, configuration de runners, secrets et contrôle conditionnel des étapes.',8,9,NULL),(41,'370e52a9-7878-40de-9cf5-29f4f28b2b34','Déploiement automatisé avec Webhooks & FastAPI','Mise en place d’un microservice FastAPI pour recevoir les événements webhook GitHub (type workflow_run), analyser les payloads et déclencher dynamiquement le script deploy.sh pour mise à jour backend ou frontend en production.',8,9,NULL),(42,'c943d222-3a03-4f71-a684-a2399aafcd69','Orchestration basique avec Kubernetes','Déploiement d’applications avec Kubernetes, création de fichiers Deployment, Service, Pod, configuration du cluster, liaison avec volumes et accès externes. Migration de deploy.sh vers infrastructure Kubernetes.',8,9,NULL),(43,'076d69a2-a4f2-4443-998b-04f97e0feb6d','Reverse proxy & certificat SSL avec Nginx + Certbot','Configuration d’un reverse proxy Nginx avec gestion multi-application sur le même serveur. Obtention et renouvellement de certificats SSL via Certbot, configuration HTTPS + redirection HTTP→HTTPS. Lien avec un nom de domaine OVH personnalisé.',8,9,NULL),(44,'18581921-bd67-46fa-9441-681c7e4ba91c','Transfert d’images Docker en ligne de commande','Utilisation avancée de commandes docker save, scp, docker load pour le transfert et chargement d’images entre environnement local et cloud distant AWS EC2.',8,9,NULL),(45,'b3c0d4ab-f7c3-42a1-bd28-5433fe5e4d00','Automatisation avec cron, scripts Bash et surveillance système','Mise en place de scripts bash automatisés via crontab pour exécuter des tâches régulières (backup, clean, surveillance de ports/services). Utilisation de commandes avancées (grep, awk, sed, lsof, find, journalctl, htop, df, du) pour monitorer, diagnostiquer et anticiper les comportements du système en temps réel.',6,9,NULL),(46,'42760773-db10-477e-b4bc-72e2c9cb981b','Authentification et autorisation via Keycloak (OAuth2)','ntégration du serveur d’identités Keycloak dans un backend Spring Boot pour sécuriser les routes API. Mise en place de rôles, groupes, tokens JWT, scopes, protection des endpoints REST, et contrôle des accès avec OAuth2 / OpenID Connect.',2,9,NULL),(47,'4690abcf-dd3e-491b-b206-4d1fb9c4c05b','Mise en place d’un système AAA avec RADIUS','Déploiement et configuration d’un serveur RADIUS dans un environnement réseau local (Raspberry Pi) et intégration avec routeurs Cisco pour gérer les accès via Authentication, Authorization, Accounting (AAA).',2,9,NULL),(48,'cd9bc114-1226-4f62-a44b-e36d0e098a3d','Accès distant sécurisé via SSH','Connexion sécurisée aux machines distantes via SSH avec génération de clés, configuration des ports et désactivation des accès root. Sécurisation des connexions réseau et transfert de fichiers sensibles (via SCP, SSH config).',2,9,NULL),(49,'79d90c97-04a4-414d-a806-a248a4426646','Création et gestion de tunnels VPN (CLI)','Mise en place de VPN basiques pour simuler un accès distant sécurisé à un réseau interne. Utilisation de tunnels CLI et vérification de la confidentialité des échanges inter-réseaux.',2,9,NULL),(50,'6642bdab-286f-43db-923e-ff7ddfa93cd2','Vérification d’intégrité des Webhooks via clé secrète','Implémentation d’un système de vérification HMAC dans un service FastAPI pour s’assurer que les Webhooks reçus depuis GitHub sont authentiques. Rejet des requêtes non signées ou altérées.',2,9,NULL),(51,'43cdf996-2ada-44c6-bf3e-6579107b3ecd','Renforcement de la sécurité des applications Dockerisées','Gestion des variables sensibles via secrets GitHub Actions, réduction de surface d’attaque dans les images Docker (multi-stage, user non-root), protection des endpoints REST, et cloisonnement réseau dans les conteneurs.',2,9,NULL),(52,'a11368f2-2046-4245-b27c-8827736f2ae2','Installation et configuration de serveurs Linux (Ubuntu Server)','Déploiement de serveurs Ubuntu Server sur Raspberry Pi et instances cloud. Configuration initiale, mise à jour système, gestion des utilisateurs, installation de paquets, gestion des services via systemd.',1,9,NULL),(53,'4039798f-63ae-4e19-8f5f-53ceed267644','Configuration d’un serveur DHCP autonome','Mise en place d’un serveur DHCP IRL sur Raspberry Pi, attribution dynamique d’adresses IP, configuration de la durée de bail, options réseau (gateway, DNS), test sur environnement isolé.',1,9,NULL),(54,'9c98d744-f63f-4c39-9263-d116fe2ecfb0','Mise en place d’un serveur Web Apache','Installation et configuration d’un serveur Apache2 pour l’hébergement de sites web locaux, gestion des ports, configuration de virtual hosts, accès sécurisé via pare-feu et test dans un réseau local.',1,9,NULL),(55,'99b8d4e6-402b-48b2-a135-a143e78a3d5c','Déploiement DNS local (Bind9)','Création d’un serveur DNS local avec Bind9 : zones directes et inversées, résolution de noms personnalisés dans un lab privé, tests avec nslookup, dig et surveillance via logs DNS.',1,9,NULL),(56,'54f09e00-e372-4ce4-9027-c4ffe36908ca','Exploration des services Active Directory (Samba)','Découverte et configuration partielle d’un contrôleur de domaine Active Directory avec Samba4 sur Ubuntu Server. Création d’un domaine, gestion de comptes, tentative de jointure de clients Linux via realm.',1,9,NULL),(57,'25808910-bc71-453b-8e36-ccee2cb0d3cc','Conception de bases relationnelles (MCD, MLD)','Modélisation des bases de données via Looping : création de MCD (entités, relations), transformation en MLD et en schéma physique. Normalisation, types, clés primaires/étrangères et intégrité référentielle.',9,9,NULL),(58,'c5fd037c-e16c-485c-852f-5575717a572e','Requêtes SQL sur MySQL et PostgreSQL','Maîtrise des requêtes SQL classiques (CRUD, jointures, sous-requêtes, agrégats), création de vues, procédures simples, gestion des droits utilisateurs. Utilisation de MySQL Workbench, pgAdmin, psql, mysql.',9,9,NULL),(59,'35f2005a-caa2-4b9f-9d49-8eae15e4acd6','Sauvegarde et restauration de bases SQL','Backup des bases avec mysqldump ou pg_dump, restauration via mysql ou psql, import/export .sql et .tar, gestion des encodages et des contraintes FK, notamment dans des contextes conteneurisés Docker.',9,9,NULL),(60,'bd4c23a6-adc1-4c78-b535-b883146ba5da','Gestion réseau et configuration IP sous Linux','Configuration des interfaces réseau (netplan, ip, ifconfig), ajout de routes statiques, test de connectivité (ping, traceroute, nslookup, dig), observation des connexions (ss, netstat), filtrage via iptables.',6,9,NULL),(61,'4e07cb8a-a86e-4535-b276-e1980c7bb10a','Installation et gestion de services Linux','Installation, configuration et gestion de services réseau (Apache2, Bind9, DHCP) sur Ubuntu Server. Redémarrage, supervision, ouverture de ports, journalisation avec journalctl.',6,9,NULL);
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill_category`
--

DROP TABLE IF EXISTS `skill_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill_category` (
  `id_skill_category` int NOT NULL AUTO_INCREMENT,
  `ref_skill_category` varchar(100) DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_skill_category`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill_category`
--

LOCK TABLES `skill_category` WRITE;
/*!40000 ALTER TABLE `skill_category` DISABLE KEYS */;
INSERT INTO `skill_category` VALUES (1,'d7591791-d116-48a5-be68-3f28cc7eefd4','ADMINISTRATION SYSTEMES'),(2,'8c686b71-6e9f-4754-8806-68d6e7aa7dc0','SECURITE'),(3,'9642f52e-e9ae-45ee-9d63-0b0abf1c0001','DEVELOPPEMENT'),(4,'6aa59b16-f61d-40a6-ade1-7cc792f2b9dd','LOGISTIQUE'),(5,'454c356b-8012-471c-94c3-48d560aa777a','Réseau'),(6,'e2ed0013-c76e-4678-ab96-49886664f9be','Systèmes Linux'),(7,'dbf37cfa-8ba0-43e1-b5f0-17b5b02e8709','Virtualisation'),(8,'2594bb91-893a-4ab8-a8f5-c76d4970b85c','DevOps'),(9,'27ba9628-db92-43bd-90bd-3681dac756c8','Bases de données');
/*!40000 ALTER TABLE `skill_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `id_tag` int NOT NULL AUTO_INCREMENT,
  `ref_tag` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id_tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `id_token` int NOT NULL AUTO_INCREMENT,
  `value_token` varchar(1024) DEFAULT NULL,
  `status_token` tinyint(1) DEFAULT NULL,
  `expiration_token` tinyint(1) DEFAULT NULL,
  `id_account` int DEFAULT NULL,
  PRIMARY KEY (`id_token`),
  KEY `token_ibfk_1` (`id_account`),
  CONSTRAINT `token_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (77,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYW5uaWVAZGpvYm8uZnIiLCJuYW1lIjoiZGFubmllIiwicm9sZXMiOltdLCJleHAiOjE3NDM1MDg3NTF9.uj6wzn2BLDQqF6N3aT1VlrzBpvfQ2UgV530JDPW7mTM',0,0,9),(78,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYW5uaWVAZGpvYm8uZnIiLCJuYW1lIjoiZGFubmllIiwicm9sZXMiOltdLCJleHAiOjE3NDM1MDg5Mzd9.Eg2qafUBrJ5DmIiz8SeaKYXwEGNbRjyPXHBhDHSfogI',0,0,9),(79,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYW5uaWVAZGpvYm8uZnIiLCJuYW1lIjoiZGFubmllIiwicm9sZXMiOltdLCJleHAiOjE3NDM1MTA2MDd9.T8XuSIOMs19sINJli7rTDmHqAaJi4h28QypUD5A4cIA',0,0,9),(80,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0MzUxMjM2Niwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.T0tvMny0kKkr7npaBiNv4XsDrp8SaX6f1O9M1NkZHqI',0,0,9),(81,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0MzUxMzE4NSwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.BajLAWBwgIrdZ9mKMIP_XWhu_z8GolatV1LjEz281q0',1,0,9),(82,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0MzUxMzM3MCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.wrf4qs9iNc0n-q4DYydlgA9rRzBZjRfcD3NHH0ogZgw',1,0,9),(83,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNTE0MjQyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.5DPiuyjU4Cl3ZdB21HRuPj8gzqAEej394958tM2LyWw',0,0,9),(84,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNTE0ODIxLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.EXMlyIekpy6oCBsuwN2CBCrc875OjdWZEZAkmRJu4ok',0,0,9),(85,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDM1MTYwNjB9.H8oKVpz8NQBvnr3YQ5mrz6K6XNDS-QuplcH8X_9CJ88',0,0,9),(86,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDM1MTc2MjR9.KK_b6Ff3FwzaKNZSazFxYCdXmddbvj5aR22Sx2kCSc4',0,0,9),(87,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDM1MTgwNjB9.bva-1YJy0BgunSjwdwkB46p1MHjKqmZegE5mwOpP2Cg',1,0,9),(88,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDM1MTgxMzN9.bEQ-uml_A5XXaFhcrHWRyKSEwyF8LZ0QtDuds6PbsA4',0,0,9),(89,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDM1MTgxNTF9.SeOWa8kZXpnReZs8BTFAHVdwqC3SDNOyHYUp6DnpafI',1,0,9),(90,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDM1MTgxODJ9.aMvv5_ps0OhH_3e5ylDT6BsMW5BEsBuoNCe1MW0Foo8',0,0,9),(91,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDM1MjQ0NjJ9.NPIFsysfS7RgbdH8V4VMJcKG232ewEgmM-tpXaVXYvI',0,0,9),(92,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0MzUyNTA2NCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.wLVWEa9yFmn7wYi7uDUEyf3E10VUhWiKP3kYBg9gy_4',0,0,9),(93,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkYW5uaWVAZGpvYm8uZnIiLCJleHAiOjE3NDM1MjYyODcsInJvbGVzIjpbeyJpZFJvbGUiOjIsInJlZlJvbGUiOiJiMGY4ODEzYi1jNjYzLTQ4MWEtYjU5Ni00OTA3N2ZiZDY0NTAiLCJuYW1lIjoiVklTSVRPUiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJkYW5uaWUifQ.Q4a53vQJKIIqMANgVZutIale0AyyB-TaVGE6z5ZGg7o',0,0,10),(94,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0MzUyNjQxMSwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.oIejP6PyF71NL5K9RRreaJu48zB_FVACRaCWxUyXfmM',0,0,9),(95,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0MzUyODQwOCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.S2uCQgZPZKa84DTD7dxeByF7NNglENoFJJHj4nKq0Ow',0,0,9),(96,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjI3Njk5LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.OYRP_pYX8wK68_BW6sPUyLgxKyPyBrLzzLgaRPeMUqI',1,0,9),(97,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjI3NzkzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.Av2xgg-HIgJ1Mhsbert2IWQXiQ6do-CG6pc6JGnv1A0',0,0,9),(98,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjMzMDQwLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.A57J07dYW-UDYRSbfrXwKFHtrZ39kZ5O9D2M2Gn_iu8',0,0,9),(99,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjMzNzUwLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.p4ITNx9OGjMn1btBIzGaDhctV_DCj4F4gcoikBamLBY',0,0,9),(100,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjc4OTkzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.Ob9yktxUWxWx2fOwXeEaDcV1Kq47dKvEpv3WzmIK7oc',0,0,9),(101,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjgyOTI3LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.bWqwCl-K1yXReaql1DqFw6AzIue37lrbERyGgebpn_M',1,0,9),(102,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjgzMjExLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.lFPcZF7jyV5bptr3THrfS5cLIaKDfX3Ex1pNNlCkTPY',0,0,9),(103,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjg0MjQyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.Y-ORIFgHTzzQ01gUlZOlOhxfBSWNdeRgBTZZl4Pl-ZM',1,0,9),(104,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjg0NzUwLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.8Wzroxh1bYAs3DEDLvTCggYXnEz1hCPN5TPFxZxB1DQ',0,0,9),(105,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjg4NTk0LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.MBZ7yrArS4SX2n2E6YbSYAwL0iFk5XUpT_8kKBydv-0',1,0,9),(106,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjg4OTg4LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.ZViV1NLLpXYNc-a69LzeIC9L7CqIXWsiVIiNuQ5qHz4',0,0,9),(107,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjkyNjMzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.P2gzit6QNSPq8sCFMT7HM5GKUnr4rsF768zeXtvdKbg',1,0,9),(108,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNjkzMjg1LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.CVVT2otFdOUOSbNxHyMCWFVJaArHGtQx4RwUz3nY4G8',0,0,9),(109,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNzA0MDc3LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.E8VMpad9wfW7IAUqMBAXJa2H7ePcR2B2HIfGIF9s6YM',0,0,9),(110,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNzA0NDgxLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.-PdiHccz3Ba3_ah9X6eF6JT3u_HVGDHY0RiSRxFZSl0',0,0,9),(111,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQzNzIwMTkzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.q2uQhXLoBzyoXtf2_JRjqAAbspO3ph4-VlLwnVNY0G8',0,0,9),(112,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0Mzc2NDY5OCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.5iPYdNAUisBs3Rj0T8EG45hYx1gpWy7j620V3Bv8qIU',0,0,9),(113,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDM4NjA2OTMsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.BZ4Y9PLF_FnI3colMd0iyUK-4aXRP6Y5K7ZS_mXFxdA',0,0,9),(114,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDM4NjEwMDYsInN1YiI6InN1cHBvcnQtYWRtaW5AcG9ydGZvbGlvLmZyIiwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.C5Z1qZC2wW-CQlHGyzeyKl1S2KaRnq3QqCbUzWqqzhQ',0,0,9),(115,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0MTU2NTcxLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.v1nwtDnSfPZA7gZWF4XU_AqqAoeFqm2Cx56wgQ1Cm_A',0,0,9),(116,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQxOTYxMjIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.yMI0t8Jv1mfM5NyYmU350o3sBDc71DZ6Gb-J4FKnCyM',1,0,9),(117,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQyMDgyMzYsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.dfcSSOMXFNT95fMMdr7RG2bXuvt8Sb4vw47k8dHCn8M',0,0,9),(118,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDMyOTEyMCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.zUxJkPtxC6xREfRECJzdFrXqenYhXxBek5jBGUsJf3I',1,0,9),(119,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDMyOTM2MCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.LAzDWXJd3dx6Bwtq8vSp8_xm6kJyMGwRkNoLyyao7-4',1,0,9),(120,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0MzMwODUyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.hUGG7M5DFQj5W8PYrsizngGXx6dR5VTOkLuyqasZPoo',1,0,9),(121,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0MzMxMDIzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.gD45cmmJt1S8rpFbLcLOZLQb1Ii5aNW8HOZXcZP3_cc',0,0,9),(122,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDM5MDExNywicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.mlxYNsCEwX8MgYnmqL3XnW4kXiLTzAiCzMJet5KbIaM',0,0,9),(123,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDM5MDc3MCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.u4N1LejAOKZwvrSehmQibJNePxxUdP6n6eySPof6RS8',1,0,9),(124,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDQ0MTEzMDB9.4tBtpeINGmUOc-SEjJlGiKB5Vet42cPu2LjzY3GU_UI',0,0,9),(125,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDQ0MTEzMDB9.4tBtpeINGmUOc-SEjJlGiKB5Vet42cPu2LjzY3GU_UI',0,0,9),(126,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDQ0MTEzMDV9.Px0h5EjxdV917s_mROxhbKXw3_HygWOmm7cyn1Ad1Lc',1,0,9),(127,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDQ1NTE4NCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.dca41KPJt-JXLlUfsVYpvPX8nYDtUDQMSL4AWzI2hxI',0,0,9),(128,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ0NzQ1MzIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.bDTfABCEI9EjY_7sLJBfoy-r1YfYMs34Ge-C6qJuMjU',0,0,9),(129,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ1MDE1NDcsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.xzZykxo3SLXFKcl7VRhCzfbIUs7vvpHrI7yRsVuVsyc',0,0,9),(130,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ1MDE4MDMsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.4_pG0eGJP_mhIzf2MputKnWfPUpGKW5_v4CrOdR5v1k',1,0,9),(131,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ1MDE5OTEsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.fSxxIjy7PTL3NKUgIfCSodux4x8q9qGC8ScT2XqCvQs',0,0,9),(132,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ1MDIwMTEsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.gJF2gNNRKJoeBURts5T_Z-WE-nqoLWkDUS5TFj_X3s0',1,0,9),(133,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ1MDI3NTgsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.Fsw9TEvZ-_jvLbRVocmTbYRvQn2uDc8rlgdMQFnx1nw',0,0,9),(134,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDU0NDU2Niwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.qdnmzpFI2m8UJCQIqZ2lymPNwVa-2Pz5nx38By89p9s',0,0,9),(135,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDQ1NDQ5Njh9.azqKNOLMKqN3SplATBdHgHBUA2i7PirRaK3QeBtdbuY',0,0,9),(136,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDQ1NTMyNTR9._VLJujHLfqLiIih9atyzK9XSt15Y6k515B7zan5kPfM',0,0,9),(137,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDQ1NTc0MDB9.JfY9j9DkF2BMTHFMKq2aT21c5bgPubxMRfm63cb3L6c',1,0,9),(138,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NTg5MjMwLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.Nzn9OlwdvDjuvvzTAejdRrylSuYSc7s5jBoeTn0qxYk',0,0,9),(139,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NTkwMTA5LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.O4u3dijtbnk-vVxNdM7ztSgy0OJTIdZb2-PqX9Ly8ig',1,0,9),(140,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NTkyMzEyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.nUHgzCj4fH0_DjQQbbPn6AtB4FbNX4DF-p8TWw5gO6U',0,0,9),(141,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ2MDM5NTEsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.NEeFPutlkzJ5rO7yH5aq5sjyYVfk-FWr5cDzVThlQJ8',0,0,9),(142,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ2MDQwMDAsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.1PQJlUCM7hIaI7L1v5KKQu94G80xITIz_H94s2zHBtg',1,0,9),(143,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ2MDQ4NDMsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.hMFnJuN_vxMi7PPofj9H90xfGShCMG_Ayy_nKoZyu9Y',0,0,9),(144,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjQwNzEyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.VvuG2Q1iN5B-h9vEd1mVingGbKyCuPgyjluV3hzJtRA',0,0,9),(145,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY0MjQ5Miwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.OPSWI_0N503g17bvVAERdKKSBJSMhiza2_10aFoRjpA',0,0,9),(146,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY0NTY4Nywicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.GU7qLEVUkUbSGZs_dAewwqPdjY5bj1okpN0r5AaHnP8',0,0,9),(147,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY0NTc2Miwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.t316tCvqO7rqC6TUYo4PZCjrFM5By2BfodxajxpMii8',0,0,9),(148,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY0NTc5OCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.RT0AK-nCA8pu3wg66FTIhB2L17uNOBJL6aq1PaNJBto',1,0,9),(149,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY0NjE5Nywicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.gjnSCPXzWL7ALxN5Sz6rxqAh-f4UzeF_P3hFpFBlUko',0,0,9),(150,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY1MjE3NCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.cfvVHe7-0cadfT1fsSQGPEGhQlKWkag11NphwsYXNLQ',0,0,9),(151,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY1MjE5OSwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.KZiNi8i0WIUBCZ0kr1MzzfJV-A_8nofVtxmb4he8xto',1,0,9),(152,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjUyMzY0LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.UgK3qxHGHgbpnOOmmjPmAbHgY0UbcyO9A8mLelfdJX8',0,0,9),(153,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjUyMzg5LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.ry2TVVcUhr1UHLYWDplzK2eeY52Z_7xOhwVGrj9RTus',1,0,9),(154,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjUzNDU0LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.6dmTuMHpX9q-qQlKqaC-q5fv1bsj1OmbHKN7lt8jH6M',0,0,9),(155,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjUzNjE5LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.1NNedDThz9l3jRNP8cUd8SBz1cgPeKE9igeMtAzQSiY',1,0,9),(156,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjU0ODE1LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9._t9Nsm6rGvGrSa5kC4LAmFIUhJap5lkKP4ACcqQXkxE',0,0,9),(157,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjU0ODIzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.pM3FzZ4-lLLLHaGzFr2OdM3hrox9K4zLktywkYnxKZw',1,0,9),(158,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDQ2NTYxODV9.ld34ObH1BByqWCEEB6W5nADHFpQEXesMXWDYwv-X62M',0,0,9),(159,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDQ2NTYxOTN9.E9ZFJLkdXOtpD_bB_bXuelckHMjDAM9fLtZApc2U4Ro',1,0,9),(160,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY1NjU2OCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.kbSkQEpL1rmmte2jSqpwfs4xrcQXQ3tyo2y9F-E17xI',0,0,9),(161,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDY1NjU3OSwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.tJtnSsBL7xQ7W_K3lqnSRJoUlzwQBTPwTfeUv3H1X9Y',1,0,9),(162,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjU3MDMxLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.p12-83fXG4zcpL3nhz6f9-YcaJ0h2EWazumtYt2VBv4',0,0,9),(163,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjU3MDM4LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.oUh8cuE3giJ4EtkkDhwpkpj0ngYpgBY22Qx3hzCG-gA',1,0,9),(164,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ2NTc0MTAsInN1YiI6InN1cHBvcnQtYWRtaW5AcG9ydGZvbGlvLmZyIiwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.WlsvFl94WNvnQkUhyEHsGzzmMXM-E1VvrG3xyAFtvVE',0,0,9),(165,'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDQ2NjI4NjEsInN1YiI6InN1cHBvcnQtYWRtaW5AcG9ydGZvbGlvLmZyIiwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.4ZU0ksPsQy6-oZjvOq39BEP6MuBduTF0mZsECoJ4emw',1,0,9),(166,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjY0MzcxLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.8h6Klj4hM0_M2G_iHl-m6d9OMv50e-JrZv9k9PTMG_s',0,0,9),(167,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjY3OTczLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.gYeXLQ4mRw4UgsmCr7PgzAUN_mGfcGIl7H6MdyNtmWE',1,0,9),(168,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NjY3OTk2LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.DtKHtBne0_TtbWaNMc_lD7V8SO72xBOLHKkPMJlxjYE',1,0,9),(169,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDcyMzc1Nywicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.kNzF8m24HAEicPubiaz9H5pVzZpefrl4Yy7lvvMhrpg',0,0,9),(170,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDc1MDc5MSwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.PVEvvipK7FP30T6lqTfZPDpkPlQ-zeqUcJi5uVeO-NY',0,0,9),(171,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NDc1Mjc1MSwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV0sIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.zC2Rt2k1-q87awoNW7IrwnKVhjDcrEL7YLAdZksBWp4',0,0,9),(172,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDQ3NTgzOTh9.hnnHH9a4Pa_RFt7EU_wUa7smrPV-I8Gs9B4IeetogBA',0,0,9),(173,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0NzYyNTUyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.9UH5mwQQUZ_a4HRVPMJPULry0HkR0t8oWy53QzQu7Jk',0,0,9),(174,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0ODAwNjEyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.hvZDzvz1nkedAzucgHqxk1Cyl0OWbi9-ALbpunF3Ots',0,0,9),(175,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0ODA0Mzk4LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.Z-JIe2CiWJIu2wLmZ-iR_Xl10ushAn5hrjFjsKvBrL4',1,0,9),(176,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0ODA1NDUxLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.Eiv4Dz2PRcXkn9G-p8KUfMHOL0OQaWHPrnuNPvT77jU',0,0,9),(177,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ0ODExMTg0LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.610y1iEcuAu6xVK10O6Oj8KAzA8WTxVZt0iGZFdqu5I',0,0,9),(178,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyIsInJvbGVzIjpbeyJpZFJvbGUiOjEsInJlZlJvbGUiOiI0ZDI2NmQ5Ni01NmY0LTQwN2QtYTU4NS1jZTY3OWFjZDM1OGYiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9ucyI6W10sImF1dGhvcml0aWVzIjpbXX1dLCJleHAiOjE3NDUxNjA1MjF9.U0GOT-B_0qCVoHOGapfR0Hx6cRMRPfJ7UfwPIENaQh0',0,0,9),(179,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDUxNjIyMTl9.g_ImU3UIU3L9w_nAj82CNPvX229Hm0WbXtTIK8sIf8I',1,0,9),(180,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDUxNjYyMTh9.bAY1LQTYY64UoK8Guns1tE0nCRqZGz2W3SLA7D1iVZo',1,0,9),(181,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwibmFtZSI6InN1cHBvcnQtcG9ydGZvbGlvIiwic3ViIjoic3VwcG9ydC1hZG1pbkBwb3J0Zm9saW8uZnIiLCJleHAiOjE3NDUxNzcxMTN9.j6Z75ChsqQG3TIe9Pakgvb12yL_Rb98NWpPRwKggPSU',1,0,9),(182,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc0NTIzNDY4OSwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.cpfz21zq0PkJ6lVkQaBuTCn8B690SCskRKUQxEk-_lI',1,0,9),(183,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ1Mjc5NzcwLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.9871HtijJ9Kx409q2cKX3lvtn2SFqRYquSTh-RdPCBE',0,0,9),(184,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzQ1NDQ3MzkzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciJ9.LGEQXAXfUaztYo2qzEYLe-OpO8qH_HoSPm6Mdf3gSPo',1,0,9),(185,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc1MDIzMzcxNywicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.tKdCojN6QGv5aDrYGqd-yYUvKM_kp63SkT9vgvqlrlU',0,0,9),(186,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc1MDIzMzcxNywicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.tKdCojN6QGv5aDrYGqd-yYUvKM_kp63SkT9vgvqlrlU',0,0,9),(187,'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoic3VwcG9ydC1wb3J0Zm9saW8iLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsImV4cCI6MTc1MDIzMzcxOCwicm9sZXMiOlt7ImlkUm9sZSI6MSwicmVmUm9sZSI6IjRkMjY2ZDk2LTU2ZjQtNDA3ZC1hNTg1LWNlNjc5YWNkMzU4ZiIsIm5hbWUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiYXV0aG9yaXRpZXMiOltdfV19.T3zJ3B-fjEp6V9hjSEVXmi-hZ5XIXj5UY5MXcKJ7XFU',1,0,9),(188,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzUwMjMzODg5LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.3HcNrW9soWnNJohUiZlcRMydodOshavKiYmkYQ8xCIA',1,0,9),(189,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzUwMjM2MTQ4LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.MoKw8TiDd00tLJCGW7RomrnXddac8HGesX_o03Swi2E',1,0,9),(190,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzUwMjM5MTI3LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.HHX6hS9MyV12SOMwtMTTL45uz6IP7Sk9WhGckNWg4j4',1,0,9),(191,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzUwMjQxNTY2LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.o4HzzzNEhSJ4h_39h2OoxBTWL6BiSBfV9JwwsEhF9AY',1,0,9),(192,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzUwMjQyODk3LCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.WfGArB42JNwpShQUmS7OR2VKnaO4YzPprOWaW_9Dr3g',1,0,9),(193,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzUwMjQ0NTQzLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.UDkihH1vBv9mphzU15PLQuW8Rd7coY0jFSa0MTpnPb4',1,0,9),(194,'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6W3siaWRSb2xlIjoxLCJyZWZSb2xlIjoiNGQyNjZkOTYtNTZmNC00MDdkLWE1ODUtY2U2NzlhY2QzNThmIiwibmFtZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOltdLCJhdXRob3JpdGllcyI6W119XSwiZXhwIjoxNzUwMjQ3NDYyLCJzdWIiOiJzdXBwb3J0LWFkbWluQHBvcnRmb2xpby5mciIsIm5hbWUiOiJzdXBwb3J0LXBvcnRmb2xpbyJ9.uo_0bHPpOdbGEDqFoW0kHPMd4LuLRrfwVAmE29uDQqY',0,0,9);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training`
--

DROP TABLE IF EXISTS `training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training` (
  `id_training` int NOT NULL AUTO_INCREMENT,
  `ref_training` varchar(100) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `diploma` varchar(50) DEFAULT NULL,
  `year_of_obtaining` date DEFAULT NULL,
  `id_establishment` int NOT NULL,
  `id_account` int NOT NULL,
  PRIMARY KEY (`id_training`),
  KEY `id_establishment` (`id_establishment`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `training_ibfk_1` FOREIGN KEY (`id_establishment`) REFERENCES `establishment` (`id_establishment`),
  CONSTRAINT `training_ibfk_2` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training`
--

LOCK TABLES `training` WRITE;
/*!40000 ALTER TABLE `training` DISABLE KEYS */;
INSERT INTO `training` VALUES (11,'f9d63ce2-3b1e-415e-a690-986871d38fc5','ADMINISTRATION INFRASTRUCTURES SÉCURISÉES ET CLOUD','Master 1','2026-07-31',8,9),(12,'e8df781b-6cd4-42fa-9b5d-a864099f392a','Architecte Logiciel - POEC','Certification Java fondation','2023-01-02',1,9),(13,'c21f8a37-107e-43de-8575-a2779bc445f5','Informatique ','Licence','2021-07-22',2,9);
/*!40000 ALTER TABLE `training` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uuid`
--

DROP TABLE IF EXISTS `uuid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uuid` (
  `id_uuid` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uuid`
--

LOCK TABLES `uuid` WRITE;
/*!40000 ALTER TABLE `uuid` DISABLE KEYS */;
INSERT INTO `uuid` VALUES (1,'d71b626d-e497-4198-8ea9-3ba62dbd2894'),(2,'4d266d96-56f4-407d-a585-ce679acd358f'),(3,'b0f8813b-c663-481a-b596-49077fbd6450'),(4,'161d62c3-e272-457a-8dee-ae8c4f163924'),(5,'bd702a3a-118a-44cd-b475-555f12d6c188'),(6,'5b9b36bd-0543-4308-be65-1a7b3ebcb28a'),(7,'22618e06-b2f3-4c73-9fad-0671161ddf99'),(8,'18729af3-f0d4-4403-80ee-54bbf46bcef9'),(9,'320b6d5c-66f5-4a1b-acea-01d00d0139d0'),(10,'b6c311ea-59d8-4329-b43e-6128784d1343'),(11,'b7f3b4b6-888d-40dc-83c4-63ddc40fc81f'),(12,'6ecd29ec-7a6e-4e93-bab2-da5853446aa5'),(13,'98be09a0-469f-436f-93ec-ca8494250503'),(14,'55feae5a-7429-420c-a52c-1e436ef80e55'),(15,'6d054cf0-3280-47ad-8c7e-efdcbb79adc9'),(16,'4793437b-c13c-4ee1-b58c-92557cc1aec3'),(17,'ebae381e-983a-4f5d-85dc-9f032b13f0eb'),(18,'20e06622-80c2-4ba7-8b18-2dcdf1391251'),(19,'ed80f73d-5c0d-40df-a6b4-4851687bcfc9'),(20,'61d9c26d-599d-46fa-8048-e776517bd406'),(21,'1326faf0-13e3-459d-a8ea-490c9f4df701'),(22,'4d75f170-4fa5-4722-80c5-367a4930b75c'),(23,'1c17e7d1-9b82-4055-b7e8-4bcb55d8e332'),(24,'a983abb8-6c97-48e2-b1a7-ce3efaee1cb3'),(25,'c4655bd3-7d46-40bf-8497-54cb3ef1629a'),(26,'9d231036-8860-45de-885e-9790cbed93c8'),(27,'119ae482-5673-4fed-aa1f-d08ea54b074c'),(28,'18ebb4b5-3e99-48d9-a0a4-be1dcc516b34'),(29,'a70c15a9-ca0c-413f-ac6c-392d8cc54e50'),(30,'acae1545-38d5-4c87-9cce-85aedec59929'),(31,'00233f88-2102-4687-afe7-35201b14f116'),(32,'46c7dc98-aab6-40a1-afc8-4827787b24f4'),(33,'c2356c4b-2415-400d-a38c-2f1d3a0997f6'),(34,'e9266fc1-3c63-4364-95ad-d9854847e527'),(35,'275c195e-8fe0-4192-9d78-02d7666e9d42'),(36,'fd527327-bd85-452a-8b03-4ff4dc7e9f90'),(37,'b04e4409-9adf-4e01-8326-7c3d048cb3d3'),(38,'b01264b1-9ce3-47d0-9a8f-a4700735c4b5'),(39,'7c2c1452-11db-491a-ae1f-193de5137e03'),(40,'d8e2f2a1-cbf2-4ec6-ae64-d1f161971ce0'),(41,'098472e0-fbb5-43f1-8769-918773f76795'),(42,'1679996a-6f45-4b0f-b8ed-54ea8921aa36'),(43,'7924afb4-cc1f-462a-9bce-5fc341e6d82e'),(44,'cd1f52ed-025a-4652-b98a-dd6203551cda'),(45,'9adeb434-f7ec-4775-9ddf-3f1656b8c969'),(46,'12e97e5c-33cb-455a-8f0f-249ee1674ffd'),(47,'11a16fb0-5341-49cc-ac32-24c3c8ae7007'),(48,'4a949f2b-e01d-45c6-b181-c4526e8835c9'),(49,'a4a3eebd-cf80-41d3-a615-2990cd72fbbe'),(50,'e7c1dc0e-998c-4c77-b895-c763f9be5de3'),(51,'89dbaa2d-b509-43f1-9662-1b672d124679'),(52,'e6e8257d-c35e-4862-bf41-c801dfe8451a'),(53,'3de48618-2407-4f5d-96a8-9d43b2dc6576'),(54,'5297eb2d-9201-44f3-bcba-a3635136d6cc'),(55,'7c953934-9c36-4e2f-89c4-4457d4c45939'),(56,'96abd999-00af-477a-8652-5ac2da3f9cf0'),(57,'016093f7-4e79-4281-af72-b40d66dab9d4'),(58,'e4612e1e-223e-421d-a98f-dd5e1faebd47'),(59,'18074a00-99bf-474a-8207-d8e78a4b2914'),(60,'272e0fa0-7936-4a30-86a3-063070b1630e'),(61,'a5c59f0f-e1b3-4015-a881-536c3edaf745'),(62,'ab99095b-4b03-47fd-8ce8-4084d0664675'),(63,'e980c0ed-fbd0-4246-853f-f36d7f4daff1'),(64,'9a6aaeec-c5ea-487f-a95f-8b78e01f05fe'),(65,'40b8da1f-74a9-4977-b9df-997f6e5bc705'),(66,'9b42c743-de7d-4202-9ea9-1bfebd0d2030'),(67,'9de70e2e-8002-4788-8d3f-53fb1d161ae7'),(68,'98f85b6e-2226-4066-9b40-54ead15711ba'),(69,'91927fdb-9d43-4688-a657-b536bf9c9de7'),(70,'ca0ec2c9-2bed-48a2-9560-ae5fdf6cb34a'),(71,'fa4a4208-9a52-485c-a9cd-9a1a7a931ce9'),(72,'3b01ff34-6332-41b7-a7e1-a522bd777fc0'),(73,'13fd520e-52bf-4a04-a491-ee3b385226d0'),(74,'ec15877c-a157-49c7-be05-39074125fa48'),(75,'038f45cc-5d54-4b26-a0ea-44a8a00f96a0'),(76,'e8c1b538-bb67-44e3-9fa4-c24743332551'),(77,'473ef523-db7b-48d6-99ff-a80e237b9330'),(78,'985f9847-89f4-4193-a26d-6f769e638f19'),(79,'437d61e6-21f4-4567-940c-fc700fb78517'),(80,'f6b75335-eee5-45cc-b61d-cf264a8a6296'),(81,'43f44236-ad54-4f6a-a739-da77217067fb'),(82,'6e78ceec-223c-4445-801c-bdc512af8ac0'),(83,'6969a630-a203-46a9-8fa4-a5eabc01733b'),(84,'d65a9638-5564-4d54-8bc5-3291d5a3fbb4'),(85,'f305ce96-3b05-4b28-9270-ce747a26fa99'),(86,'f6fb7a81-f14c-4948-81ef-41ee78a2048d'),(87,'b1d8cc6b-8aff-48a6-8955-4acb19d6af22'),(88,'4337aa2b-dd6e-4544-9312-9fc23726db22'),(89,'7677c398-d976-4fb9-a270-f544b9d22de5'),(90,'520805e4-fa25-4174-9f36-0d8277770e9b'),(91,'e42738bd-6dc4-4937-a75a-54e9df1c5d65'),(92,'043ad10f-fbca-4756-b817-4d95db6b4027'),(93,'bd908476-7323-4ebd-b1f6-df26770554fd'),(94,'7b2f4c5f-416f-43cd-b519-13c0b8518f23'),(95,'dd26f9b8-b0c4-4e42-9903-82cf68737e62'),(96,'14fe95d0-cf77-4d7a-a0b4-ab7160690453'),(97,'20fd8a81-8a8f-4dd4-8d09-f6275cc4fe90'),(98,'6bdc2a79-4160-4dee-8e51-52853bf003fb'),(99,'52e1ebb0-ad0e-4828-916a-180892680376'),(100,'99387df3-57ac-4f1b-82f2-545d21facc77'),(101,'ac4eedd9-f519-4ef2-9d8e-b00385dda7ab'),(102,'cf1d0def-cddd-4a9b-9dd8-a6556878c16e'),(103,'9ab298c3-d826-453c-965a-07362e349a83'),(104,'f7717b29-620a-4a7f-9de3-8f650035dd27'),(105,'d7591791-d116-48a5-be68-3f28cc7eefd4'),(106,'8c686b71-6e9f-4754-8806-68d6e7aa7dc0'),(107,'9642f52e-e9ae-45ee-9d63-0b0abf1c0001'),(108,'6aa59b16-f61d-40a6-ade1-7cc792f2b9dd'),(109,'52180592-3062-4ccc-911d-bd55049ba67c'),(110,'54d4a03e-7211-4e52-ac95-93739de89de9'),(111,'0defb6e2-5e40-4beb-b6a6-80542e4f4a33'),(112,'f2ada9a1-2012-43c2-8af2-1d39da4a0530'),(113,'454c356b-8012-471c-94c3-48d560aa777a'),(114,'e2ed0013-c76e-4678-ab96-49886664f9be'),(115,'dbf37cfa-8ba0-43e1-b5f0-17b5b02e8709'),(116,'2594bb91-893a-4ab8-a8f5-c76d4970b85c'),(117,'27ba9628-db92-43bd-90bd-3681dac756c8'),(118,'b11225d4-5cef-44a5-9b9a-e311e492832a'),(119,'d4b0c3cb-207d-4003-8867-d739842c50e0'),(120,'5cbb8102-e65f-4521-bcdc-a919bcf11f43'),(121,'6782c765-e434-4e1d-a37e-431c48189591'),(122,'76fa3a98-15b4-4afc-8f16-fcc754bab6dc'),(123,'882a9dd4-c3e9-49f8-877c-47617c19b4d5'),(124,'318704c4-16b1-43f3-a432-100a4ae151b4'),(125,'0fc0e85a-7cc9-4833-84c4-dd023ab6ae55'),(126,'ad000b40-fc72-4969-ab16-b7588c96e03b'),(127,'2a6137ec-6fdb-41d9-bdf9-f4545aa2ffef'),(128,'15449439-61ba-4d23-973d-42096856fa58'),(129,'f6b548b4-661d-4811-8c34-6d433ecaa9fd'),(130,'40c2251b-0881-4d9b-8acf-1e5d89caf5b2'),(131,'2607b726-8e00-4aac-ba92-a39da024d7ec'),(132,'88f3a35b-1553-4cc3-bc2e-abdf99e2b980'),(133,'1a91fbb0-e7c8-4ca2-bee1-5aad900c2360'),(134,'20c65a0c-fb12-41a4-b488-241c2150bd6e'),(135,'a1fa29fd-3e40-4e4d-9f23-fff110e972df'),(136,'8b593e31-2ef5-4c07-bfb9-d5b7bff73f87'),(137,'cdb808af-f485-43dd-bca4-603b72a69cd4'),(138,'ce2560e3-01f0-45a5-90b4-f8a41d74b030'),(139,'ff0de41d-eb4a-45fa-863a-9a55ccd40661'),(140,'f78d47e4-a1cb-497d-8ce3-8475ea63173c'),(141,'f5130845-2e75-48d0-8c3f-16b74f339d36'),(142,'fc1d9218-f1f2-455d-830b-84a47d69b0a4'),(143,'eee70e0e-40b2-4e0c-9f50-2f1ecb122cf7'),(144,'4f192286-0152-4d3b-8d0d-72ee8001d8a8'),(145,'f048787b-12cb-42b3-be42-bf884e6d1a71'),(146,'94581afa-4f99-48ef-a240-a8f7eb0e2af9'),(147,'85e54ad5-c5a1-4a41-8cca-1f40f853ae39'),(148,'660bcfe3-21ca-4f46-8750-712e713bfdc6'),(149,'b26f8d7a-0601-4331-bf5c-fa1cfde2e64b'),(150,'14312aee-3c90-4034-8843-a0cd92ec5397'),(151,'f544f707-550a-45a5-a791-9898562d3780'),(152,'fa2ce0c3-05e9-4727-91bd-b9e97af5794d'),(153,'05b2c975-4461-4d07-87ad-1c131d7b7f52'),(154,'6d2a925a-4279-4ea5-bf14-710b10ddefbe'),(155,'c224abe8-1b5d-4f34-aa91-7312c78b1b1b'),(156,'aea6aff4-69ba-43ca-ac58-332e2f59d759'),(157,'ab916247-658d-4754-8a06-17a4e8822344'),(158,'83632299-1d56-45b0-933b-45dc4ad54aae'),(159,'831f73c1-f54c-4e2d-a760-03a70006bb5e'),(160,'2bca739b-67da-4745-9bb5-b05dc9cfba9b'),(161,'a82f50e3-2d01-4bc3-8c4b-7ecb5c82c796'),(162,'d3f814f4-176b-4ed1-8761-6264d06f8294'),(163,'8ba1a0b1-e1f5-4799-bf48-2fe977efab54'),(164,'70be4bf0-fce6-49d6-b35b-0e698b23d15f'),(165,'0df2a516-83f8-4f19-a092-9825d395569f'),(166,'cbaf2661-c448-4f8f-8f93-d8a920d3567e'),(167,'9678339b-29cd-479a-b32c-ef9bdbc63965'),(168,'5d100e22-3c64-46ac-99c8-c1dee44f3174'),(169,'af8921fb-bf7e-47ce-bf9f-93fd0568bed6'),(170,'d6f885c4-af24-4916-b931-6d69d9b0cd66'),(171,'4e0022e1-3072-4c63-bd2f-431a6f61c32b'),(172,'52167b5e-d6e4-462c-a2c1-331455c08ac9'),(173,'38fe8d63-eabb-46a7-af9b-aa973926040a'),(174,'5cc61867-691c-4991-a92e-7177adfc36ff'),(175,'c5978ee9-eb8c-4067-964c-c1a5df0770a4'),(176,'370e52a9-7878-40de-9cf5-29f4f28b2b34'),(177,'c943d222-3a03-4f71-a684-a2399aafcd69'),(178,'076d69a2-a4f2-4443-998b-04f97e0feb6d'),(179,'18581921-bd67-46fa-9441-681c7e4ba91c'),(180,'b3c0d4ab-f7c3-42a1-bd28-5433fe5e4d00'),(181,'42760773-db10-477e-b4bc-72e2c9cb981b'),(182,'4690abcf-dd3e-491b-b206-4d1fb9c4c05b'),(183,'cd9bc114-1226-4f62-a44b-e36d0e098a3d'),(184,'79d90c97-04a4-414d-a806-a248a4426646'),(185,'6642bdab-286f-43db-923e-ff7ddfa93cd2'),(186,'43cdf996-2ada-44c6-bf3e-6579107b3ecd'),(187,'a11368f2-2046-4245-b27c-8827736f2ae2'),(188,'4039798f-63ae-4e19-8f5f-53ceed267644'),(189,'9c98d744-f63f-4c39-9263-d116fe2ecfb0'),(190,'99b8d4e6-402b-48b2-a135-a143e78a3d5c'),(191,'54f09e00-e372-4ce4-9027-c4ffe36908ca'),(192,'25808910-bc71-453b-8e36-ccee2cb0d3cc'),(193,'c5fd037c-e16c-485c-852f-5575717a572e'),(194,'35f2005a-caa2-4b9f-9d49-8eae15e4acd6'),(195,'bd4c23a6-adc1-4c78-b535-b883146ba5da'),(196,'4e07cb8a-a86e-4535-b276-e1980c7bb10a'),(197,'312a35ff-e371-4b94-9a2d-612d938eecc5'),(198,'5cb8ee4e-11b7-42bc-9f21-1ba63267b717'),(199,'2c8ca860-fa6a-4b61-a00e-b2e8199eafb6'),(200,'fe1d9a64-e440-4ec4-946f-91604b53d18a'),(201,'2d6ad9f3-349a-418d-a400-7884deb8c48e'),(202,'f9d63ce2-3b1e-415e-a690-986871d38fc5'),(203,'e8df781b-6cd4-42fa-9b5d-a864099f392a'),(204,'c21f8a37-107e-43de-8575-a2779bc445f5'),(205,'55f5fdf1-ae93-4f3f-8fb2-44d45d8fe2f9'),(206,'a074dc73-71be-4b82-a6a2-c0df39a10eec'),(207,'a302f249-d176-4ea1-8163-70801302d571');
/*!40000 ALTER TABLE `uuid` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-18 11:52:01
