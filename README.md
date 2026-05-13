# e-Mutuelle — Digital Health Insurance Management System

A web-based management platform for Rwanda's community-based health insurance scheme (*Mutuelle de Santé*). Built with Spring Boot and vanilla JavaScript, **e-Mutuelle** streamlines member registration, contribution tracking, and coverage management using Rwanda's **Ubudehe** socio-economic classification.

---

## Features

- **Member Management** — Register members, search by name, track coverage status, and update Ubudehe categories
- **Payment Processing** — Record contributions via Cash, Mobile Money, Bank Transfer, or Card; auto-activate coverage upon payment
- **Dashboard Analytics** — Real-time statistics: total members, active coverage, pending payments, total collections
- **Receipt Generation** — Auto-generated payment IDs and receipt numbers for every transaction
- **Responsive UI** — Mobile-friendly single-page application with toast notifications and live search

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.1.5 |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Icons | Font Awesome 6.4.0 |
| Build | Maven |
| Storage | In-memory (HashMap / ArrayList) |
| Server | Embedded Tomcat — port 8080 |

---

## Ubudehe Categories

Rwanda's national socio-economic classification determines annual contribution amounts:

| Category | Description | Annual Contribution |
|---|---|---|
| Category 1 | Indigent | 0 RWF (Free) |
| Category 2 | Poor | 3,000 RWF |
| Category 3 | Medium income | 7,000 RWF |
| Category 4 | Well-off | 30,000 RWF |

---

## Project Structure

```
mutuelle-web-app/
├── src/main/java/com/mutuelle/
│   ├── MutuelleApplication.java        # Spring Boot entry point
│   ├── controllers/
│   │   ├── MemberController.java       # Member REST endpoints
│   │   └── PaymentController.java      # Payment REST endpoints
│   ├── models/
│   │   ├── Member.java                 # Member entity
│   │   ├── Payment.java                # Payment entity
│   │   ├── UbudeheCategory.java        # Category enum
│   │   └── CoverageStatus.java         # Status enum
│   └── services/
│       ├── MemberService.java          # Member business logic
│       └── PaymentService.java         # Payment business logic
├── src/main/resources/static/
│   ├── index.html                      # Single-page UI
│   ├── css/style.css                   # Design system
│   └── js/main.js                      # Frontend logic & API calls
└── pom.xml
```

---

## API Reference

### Members — `/api/members`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new member |
| `GET` | `/` | List all members |
| `GET` | `/{memberId}` | Get member by ID |
| `GET` | `/search?query=` | Search members by name |
| `GET` | `/stats` | Dashboard statistics |
| `PUT` | `/{memberId}/category` | Update Ubudehe category |

### Payments — `/api/payments`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Record a payment |
| `GET` | `/` | List all payments |
| `GET` | `/member/{memberId}` | Payment history for a member |
| `GET` | `/member/{memberId}/total` | Total amount paid by a member |

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+

### Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/mutuelle-web-app.git
cd mutuelle-web-app

# Build and start the application
mvn spring-boot:run
```

Open your browser at **http://localhost:8080**

### Build JAR

```bash
mvn clean package
java -jar target/mutuelle-web-app-1.0.0.jar
```

---

## Data Validation Rules

- **National ID**: Must follow the Rwandan format — `1` followed by 15 digits (16 digits total)
- **Phone Number**: Rwandan numbers starting with `078`, `079`, `072`, or `073` followed by 7 digits
- **Duplicate Prevention**: The system rejects registration if a National ID already exists

---

## Coverage Lifecycle

```
Registration → PENDING
Payment recorded → ACTIVE (coverage valid for 1 year)
After expiry date → EXPIRED
Admin action → SUSPENDED
```

---

## Notes

- Data is stored **in-memory** and will be reset on application restart. A database (PostgreSQL or MySQL) is recommended for production use.
- CORS is enabled for all origins to support local frontend development.
- DevTools hot-reload is enabled in development mode.

---

## License

This project is intended for educational and institutional use within the Rwandan healthcare ecosystem.
