# 🚀 My Portfolio – Cloud, DevOps & Security Playground

Professional portfolio showcasing real-world infrastructure, security, and application deployment.

## 🧭 Overview

This portfolio is a production-grade platform designed to demonstrate real-world skills in:

- Cloud infrastructure & container orchestration
- Backend & frontend application development
- Security (authentication, authorization, 2FA)
- CI/CD automation and production deployments
- Monitoring, observability and operational reliability (MCO)

This is not a demo project.
It is a fully deployed, secured and monitored system running on a real cloud environment.


## 🏗️ Global Architecture

The platform is composed of multiple services deployed in a containerized environment:

- **Frontend**: Angular application served via Nginx
- **Backend**: Spring Boot REST API
- **Authentication & IAM**: Keycloak with MFA (2FA)
- **Job Tracking Service**: NestJS microservice (scraping & automation)
- **Databases**:
  - MySQL (main application)
  - PostgreSQL (job tracking service)
- **Infrastructure**:
  - Docker & Kubernetes
  - Cloud VM (Linux)
  - Reverse proxy & TLS termination

All services are deployed in production and communicate through secured internal networks.

## 🔐 Security & Authentication

Security is a core component of this platform:

- Centralized identity management using **Keycloak**
- OAuth2 / OpenID Connect integration
- Role-based access control (RBAC)
- **Multi-Factor Authentication (2FA)** using Time-based One-Time Passwords (TOTP)
- Secure login flow: email + password + 6-digit authentication code
- Production-ready authentication, not a mock or demo setup

The administration area of the platform is protected by strong authentication policies
and is accessible only through secured accounts.


## 🚀 CI/CD & Production Deployment

The platform is continuously deployed using an automated CI/CD pipeline:

- Source control managed with Git
- Automated builds using **GitHub Actions**
- Container images built and pushed to Docker registries
- Deployment performed on a Kubernetes cluster
- Rolling updates with zero-downtime strategy
- Production updates triggered only from a secured private repository

The deployment pipeline ensures that every validated change can be safely
delivered to production with minimal manual intervention.


## 📊 Monitoring, Observability & MCO

The platform includes monitoring and operational supervision components:

- Resource monitoring at cluster and pod level (CPU, memory)
- Service health and availability tracking
- Operational dashboards built with **Grafana**
- Metrics collection designed for production workloads
- Focus on MCO (Maintenance en Conditions Opérationnelles)

This monitoring layer provides real-time visibility on system behavior
and helps ensure reliability, performance, and controlled resource usage.

## 🤖 Job Tracking & Automation

The platform includes an internal job application tracking system designed to automate
and optimize the recruitment process:

- Dedicated **NestJS microservice**
- Automated job offer collection (scraping):
  - Welcome to the Jungle
  - LinkedIn
  - Indeed
- Centralized tracking of applications and statuses
- Automated reminders and follow-ups
- Statistics and insights on applications progress

This system is accessible through a secured administration interface
and is designed to reduce manual effort while improving application follow-up efficiency.


## 🛠️ Skills & Technologies

**Backend & APIs**
- Java, Spring Boot
- REST APIs
- OAuth2 / OpenID Connect
- Keycloak (IAM, RBAC, 2FA)

**Frontend**
- Angular
- TypeScript
- Nginx

**Cloud & Infrastructure**
- Linux
- Docker
- Kubernetes
- Reverse proxy & TLS
- Cloud VM environments

**CI/CD & DevOps**
- Git & GitHub
- GitHub Actions
- Container image build & deployment
- Rolling updates

**Monitoring & Operations**
- Grafana
- Metrics & dashboards
- Production monitoring (MCO)

**Automation & Tooling**
- NestJS
- Web scraping
- Job tracking & reminders automation
