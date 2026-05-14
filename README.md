<div align="center">

# 🏥 MutualCare Insurance System
### *RSSB Mutuelle de Santé — Digital Health Insurance Management*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)](https://openjdk.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)](https://www.docker.com/)
[![Git](https://img.shields.io/badge/Git-Version%20Control-red?logo=git)](https://git-scm.com/)
[![License](https://img.shields.io/badge/License-Educational-yellow)](./LICENSE)

> A web-based health insurance management system for Rwanda's community-based *Mutuelle de Santé* scheme, administered by the **Rwanda Social Security Board (RSSB)**. MutualCare digitalizes member enrolment, family dependent management, contribution tracking, and hospital coverage verification.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Ubudehe Categories 2026/2027](#-ubudehe-categories-20262027)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Coverage Lifecycle](#-coverage-lifecycle)
- [Getting Started](#-getting-started)
- [Docker Deployment](#-docker-deployment)
- [Version Control (Git)](#-version-control-git)
- [Validation Rules](#-validation-rules)
- [Notes](#-notes)

---

## 🌍 Overview

Rwanda's *Mutuelle de Santé* program covers millions of citizens. Managing enrolment, payments, and coverage verification manually across hundreds of health facilities is slow and error-prone. **MutualCare** solves this by providing:

- A **secure multi-role web portal** (Admin, Hospital Staff, Member)
- **Automated contribution calculation** per 2026/2027 Ubudehe tiers
- **Family dependent management** linked to parent accounts
- **Real-time coverage verification** for hospital staff
- **Dockerized deployment** for consistent, portable execution

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Multi-Role Authentication** | Admin, Hospital Staff, and Member logins with session management |
| 👤 **Member Registration** | Photo upload, National ID validation, marital status, age verification |
| 🚫 **Under-18 Block** | Children under 18 cannot self-register — must be added as dependents |
| 👨‍👩‍👧 **Family Management** | Married/Divorced members can add children as dependents with photos |
| 💳 **Payment Processing** | Cash, Mobile Money, Bank Transfer, Card — with auto-receipt generation |
| 👶 **Child Insurance** | Parents pay on behalf of children; children inherit parent's Ubudehe category |
| 🏥 **Hospital Verification** | Staff search by National ID or name, mark identity verified/mismatch |
| 📊 **Admin Dashboard** | Real-time stats: total members, active coverage, pending, expired |
| 📱 **Responsive UI** | Mobile-friendly SPA with toast notifications and live search |
| 🖼️ **RSSB Branding** | Official building photo as login background, RSSB logo |

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  index.html  │  │  style.css   │  │    main.js       │  │
│  │  (Structure) │  │  (Design     │  │  (Business Logic │  │
│  │             │  │   System)    │  │   + State Mgmt)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │  LocalStorage  │  ← Members, Payments,  │
│                    │  SessionStorage│     Users, Dependents   │
│                    └────────────────┘                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP GET (static files)
┌──────────────────────────▼──────────────────────────────────┐
│              SPRING BOOT SERVER (Java 17)                    │
│                                                              │
│   Embedded Apache Tomcat — Port 8080                         │
│   Serves: index.html, style.css, main.js, images/           │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  src/main/resources/static/   (static file server)  │   │
│   └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    DOCKER CONTAINER                          │
│                                                              │
│   Image: mutualcare-insurance:1.0.0  (295 MB)               │
│   Base:  eclipse-temurin:17-jre-alpine                      │
│   Port:  0.0.0.0:8080 → 8080/tcp                           │
│   Health: wget http://localhost:8080/ every 30s             │
└─────────────────────────────────────────────────────────────┘
```

### MVC Pattern

```
MODEL                   VIEW                    CONTROLLER
─────────────────────────────────────────────────────────────
localStorage            index.html              main.js
sessionStorage    ←──   <section> blocks   ──→  doLogin()
members[]               CSS classes             memberPay()
payments[]                                      addDependent()
users[]                                         renderMembersTable()
```

### Coverage Flow

```
Member Registers
      │
      ▼
  [PENDING] ──── Admin records payment ────► [ACTIVE]
                                                 │
                                          Coverage expires
                                                 │
                                                 ▼
                                            [EXPIRED]
                                                 │
                                          Admin action
                                                 │
                                                 ▼
                                           [SUSPENDED]
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend** | Java + Spring Boot | 17 / 3.1.5 |
| **Frontend** | HTML5, CSS3, Vanilla JS | ES2022 |
| **Fonts** | Google Fonts (Inter) | — |
| **Icons** | Font Awesome | 6.4.0 |
| **Build** | Apache Maven | 3.9+ |
| **Storage** | Browser LocalStorage | — |
| **Server** | Embedded Apache Tomcat | 10.1.15 |
| **Container** | Docker (multi-stage build) | 29.4.0 |
| **VCS** | Git | 2.x |
| **Design Pattern** | MVC | — |

---

## 💰 Ubudehe Categories 2026/2027

Rwanda's official contribution structure (updated 2026/2027):

| Category | Income Level | Annual Contribution | Government Subsidy | Member Pays |
|---|---|---|---|---|
| **Category I** | No Income | 4,000 RWF | 100% (Fully Covered) | **0 RWF** |
| **Category II** | < 30,000 RWF/month | 4,000 RWF | 1,000 RWF | **3,000 RWF** |
| **Category III** | 30,000–60,000 RWF/month | 5,000 RWF | None | **5,000 RWF** |
| **Category IV** | 60,000–120,000 RWF/month | 8,000 RWF | None | **8,000 RWF** |
| **Category V** | > 120,000 RWF/month | 20,000 RWF | None | **20,000 RWF** |

> Children added as dependents **automatically inherit** the parent's Ubudehe category.

---

## 👥 User Roles

```
┌─────────────────────────────────────────────────────────────┐
│  ADMINISTRATOR                                               │
│  • Register & manage members         • Manage system users   │
│  • Record payments                   • View dashboard stats  │
│  • Update member status              • Delete records        │
├─────────────────────────────────────────────────────────────┤
│  HOSPITAL STAFF                                              │
│  • Search member by National ID or name                      │
│  • View insurance status & photo                             │
│  • Mark: Identity Verified ✅  or  Photo Mismatch ❌         │
├─────────────────────────────────────────────────────────────┤
│  MEMBER (Self-service portal)                                │
│  • View profile & insurance status   • Pay contributions     │
│  • Add dependent children (if married/divorced)              │
│  • Pay insurance for children        • View payment history  │
└─────────────────────────────────────────────────────────────┘
```

**Default Test Credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rssb.rw` | `Admin@2024` |
| Staff | `staff@chuk.rw` | `Staff@2024` |
| Member | *(self-register)* | *(your choice)* |

---

## 📁 Project Structure

```
mutuelle-web-app/
│
├── 🐳 Dockerfile                    # Multi-stage Docker build
├── 🐳 docker-compose.yml            # One-command startup
├── 🐳 .dockerignore                 # Docker build exclusions
├── 📋 .gitignore                    # Git exclusions
├── 📋 pom.xml                       # Maven dependencies
├── 📋 README.md                     # This file
│
└── src/
    └── main/
        ├── java/com/mutuelle/
        │   ├── MutuelleApplication.java     # Spring Boot entry point
        │   ├── controllers/
        │   │   ├── MemberController.java    # Member endpoints
        │   │   └── PaymentController.java   # Payment endpoints
        │   ├── models/
        │   │   ├── Member.java              # Member entity
        │   │   ├── Payment.java             # Payment entity
        │   │   ├── UbudeheCategory.java     # Category enum (I–V)
        │   │   └── CoverageStatus.java      # Status enum
        │   └── services/
        │       ├── MemberService.java       # Business logic
        │       └── PaymentService.java      # Payment logic
        │
        └── resources/static/
            ├── index.html                   # Single-page UI shell
            ├── css/
            │   └── style.css               # Full design system
            ├── js/
            │   └── main.js                 # All frontend logic
            └── images/
                ├── rssb-logo.png           # RSSB official logo
                └── rssb-building.png       # Login background photo
```

---

## 🔄 Coverage Lifecycle

```
  Register ──► PENDING ──► (Payment recorded) ──► ACTIVE
                                                      │
                                               (Year expires)
                                                      │
                                                   EXPIRED
                                                      │
                                              (Admin action)
                                                      │
                                                 SUSPENDED
```

---

## 🚀 Getting Started

### Option A — Run with Docker (Recommended)

No Java or Maven installation required.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mutualcare-insurance.git
cd mutualcare-insurance

# 2. Start with Docker Compose (one command)
docker-compose up --build

# 3. Open in browser
# http://localhost:8080
```

### Option B — Run Locally with Maven

**Prerequisites:** Java 17+, Maven 3.8+

```bash
# Clone
git clone https://github.com/your-username/mutualcare-insurance.git
cd mutualcare-insurance

# Run
mvn spring-boot:run

# Open: http://localhost:8080
```

### Option C — Build & Run JAR

```bash
mvn clean package
java -jar target/mutuelle-web-app-1.0.0.jar
```

---

## 🐳 Docker Deployment

MutualCare is fully containerized using a **multi-stage Docker build**:

### How it works

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1 — BUILD                                            │
│  Image: maven:3.9.6-eclipse-temurin-17 (~700MB)             │
│  • Copies pom.xml → downloads dependencies                  │
│  • Copies src/ → compiles Java source                       │
│  • Runs: mvn clean package -DskipTests                      │
│  • Output: mutuelle-web-app-1.0.0.jar                       │
└───────────────────────┬─────────────────────────────────────┘
                        │ COPY --from=build (only the JAR)
┌───────────────────────▼─────────────────────────────────────┐
│  STAGE 2 — RUN                                              │
│  Image: eclipse-temurin:17-jre-alpine (~200MB)              │
│  • Copies only the JAR from Stage 1                         │
│  • Exposes port 8080                                        │
│  • Health check every 30 seconds                            │
│  • Final image size: ~295MB (vs ~1GB without multi-stage)   │
└─────────────────────────────────────────────────────────────┘
```

### Docker Commands

```bash
# Build the image
docker build -t mutualcare-insurance:1.0.0 .

# Run the container
docker run -d -p 8080:8080 --name mutualcare mutualcare-insurance:1.0.0

# Check status
docker ps --filter "name=mutualcare"

# View logs
docker logs mutualcare --tail 20

# Stop container
docker stop mutualcare

# Start again
docker start mutualcare

# Remove container
docker rm mutualcare
```

### Verify it's running

```
✅ docker images   → mutualcare-insurance:1.0.0  (295MB)
✅ docker ps       → Up, healthy, 0.0.0.0:8080->8080/tcp
✅ localhost:8080  → MutualCare login page loads
```

---

## 🔧 Version Control (Git)

This project uses **Git** for version control.

### Repository Structure

```
main     ← stable, production-ready
develop  ← integration branch
feature/ ← individual feature branches
hotfix/  ← urgent bug fixes
```

### Branch Strategy

```bash
# Start a new feature
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat: description of what was added"

# Push to remote
git push origin feature/your-feature-name
```

### Commit History Highlights

| Commit | Description |
|---|---|
| `791391c` | feat: initial commit — MutualCare Insurance System v1.0.0 |
| | feat: 3-role authentication (Admin/Staff/Member) |
| | feat: 2026/2027 Ubudehe 5-tier category system |
| | feat: under-18 self-registration block |
| | feat: marital status & family dependent management |
| | feat: child photo upload in payment flow |
| | style: RSSB building photo as login background |
| | chore: Dockerfile + docker-compose.yml + .gitignore |

---

## ✅ Validation Rules

| Field | Rule |
|---|---|
| **Age (self-register)** | Must be **≥ 18 years old** |
| **Age (dependent)** | Must be **< 18 years old** |
| **Marital Status** | Married/Divorced → family card enabled; Single → self only |
| **National ID** | Rwandan format: `1` followed by 15 digits (16 total) |
| **Phone Number** | Starts with `078`, `079`, `072`, or `073` + 7 digits |
| **Photo** | Required for members and dependents |
| **Password** | Minimum 6 characters |
| **Duplicate Email** | Rejected at registration |
| **Duplicate National ID** | Rejected at registration |

---

## 📝 Notes

- Data is stored in **browser LocalStorage** — persistent across sessions, resets only if browser data is cleared
- For production, replace LocalStorage with a **PostgreSQL** or **MySQL** database
- CORS is enabled for all origins for local development
- Spring Boot DevTools hot-reload is active in development mode
- Docker health check pings the app every **30 seconds**

---

## 📄 License

This project is developed for **educational and institutional use** within Rwanda's healthcare ecosystem under the **Rwanda Social Security Board (RSSB)**.

---

<div align="center">

**MutualCare Insurance System** — *Securing Health for Every Rwandan Family*

*Built with ❤️ for RSSB Mutuelle de Santé*

</div>
