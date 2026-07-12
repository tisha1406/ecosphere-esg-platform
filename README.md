# 🌍 EcoSphere — ESG Management Platform

> A **production-quality**, full-stack ESG (Environmental, Social, Governance) Management Platform built for the **Odoo Hackathon 2026**.
> Enables enterprises to **track, manage, and gamify** their sustainability initiatives — end-to-end, from emissions logging to reward redemption.

---

## 🚀 Live Service URLs (after startup)

| Service | URL |
|---|---|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger / OpenAPI Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

## 🔑 Demo Login Credentials

**All accounts share the same password: `Demo@1234`**

| Role | Email | Access Level |
|---|---|---|
| **Admin** | `admin@ecosphere.com` | Full access — Settings, User Mgmt, all modules |
| **ESG Manager** | `manager@ecosphere.com` | All modules, create/edit across E/S/G |
| **Environmental Officer** | `env@ecosphere.com` | Emissions, Energy, Waste |
| **Social Officer** | `social@ecosphere.com` | Wellbeing, CSR, Diversity |
| **Governance Officer** | `gov@ecosphere.com` | Policies, Audits, Compliance |
| **Employee** | `employee@ecosphere.com` | Dashboard, Gamification, own points |

> **Recommended starting point for evaluation:** `admin@ecosphere.com` — gets you access to all tabs including Settings and User Management.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Tanstack Query |
| **Backend** | FastAPI (Python 3.11), SQLAlchemy 2.0 (async), Pydantic v2 |
| **Database** | SQLite via `aiosqlite` (zero-config local dev) |
| **Auth** | JWT Access + Refresh Tokens, RBAC, Rate Limiting |
| **Migrations** | Alembic |

---

## 📦 Getting Started — Step by Step

### Prerequisites

Make sure you have:
- **Python 3.11+**
- **Node.js 18+** and **npm**
- **Git**

---

### Step 1 — Clone the Repository

```bash
git clone <repo-url>
cd ecosphere-esg-platform
```

---

### Step 2 — Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt
```

---

### Step 3 — Configure Environment Variables

```bash
# From the PROJECT ROOT (ecosphere-esg-platform/)
cp .env.example .env
```

The `.env.example` is pre-configured for local SQLite — **no changes needed** for a local run.

```env
DATABASE_URL=sqlite+aiosqlite:///./backend/ecosphere.db
JWT_SECRET=supersecretjwtkey
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173,http://localhost
VITE_API_BASE_URL=http://localhost:8000
```

---

### Step 4 — Initialize the Database

```bash
# From the backend/ directory (with venv active)
cd backend

# Create all tables and seed demo data
python init_sqlite_db.py
```

This script will:
- Drop and recreate all database tables
- Seed **6 demo users** (Admin, Manager, Environmental, Social, Governance, Employee)
- Seed company settings, departments, emissions data, CSR initiatives, gamification badges, and ESG scores

---

### Step 5 — Start the Backend Server

```bash
# From backend/ directory (with venv active)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### Step 6 — Start the Frontend Dev Server

Open a **new terminal** and run:

```bash
# From the frontend/ directory
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in Xms
  Local:   http://localhost:5173/
```

---

### Step 7 — Open the App

Go to **http://localhost:5173** and login with any credential from the table above.

---

## 🗂️ Project Architecture

```
ecosphere-esg-platform/
├── backend/
│   ├── app/
│   │   ├── api/v1/            # REST API routes
│   │   │   ├── auth.py            # Login, register, refresh, forgot-password, user management
│   │   │   ├── environmental.py   # Emissions, Energy, Waste, Carbon Transactions
│   │   │   ├── social.py          # Wellbeing, CSR, Diversity, Participations
│   │   │   ├── governance.py      # Policies, Audits, Compliance Issues, Board Activity
│   │   │   ├── gamification.py    # Badges, Challenges, Rewards, Leaderboard, Points
│   │   │   ├── settings.py        # Company settings CRUD
│   │   │   ├── master.py          # Departments, Categories, EmissionFactors, Goals
│   │   │   └── dashboard.py       # Aggregated KPIs
│   │   ├── models/            # SQLAlchemy ORM models (modular by domain)
│   │   │   ├── environmental.py   # Company, Facility, CarbonEmission, EnergyUsage, WasteTracking, CarbonTransaction
│   │   │   ├── social.py          # EmployeeWellbeing, CSRActivity, EmployeeParticipation, DiversityMetric
│   │   │   ├── governance.py      # Policy, PolicyAcknowledgement, Audit, ComplianceIssue, BoardActivity
│   │   │   ├── gamification.py    # Badge, Challenge, ChallengeParticipation, Reward
│   │   │   ├── scoring.py         # PointsLedger, EsgScoreSummary, DepartmentScore
│   │   │   ├── master.py          # Department, Category, EmissionFactor, ProductESGProfile, EnvironmentalGoal
│   │   │   ├── settings.py        # CompanySetting (targets, thresholds, business rule toggles, weights)
│   │   │   ├── user.py            # User, UserRole
│   │   │   └── notification.py    # Notification
│   │   ├── schemas/           # Pydantic v2 request/response schemas
│   │   ├── services/          # Business logic layer
│   │   ├── repositories/      # Data access layer
│   │   └── core/              # Database, security, dependencies
│   ├── init_sqlite_db.py      # One-shot DB init + seeder
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── features/          # Feature-sliced architecture
        │   ├── auth/          # Login, registration, forgot password
        │   ├── dashboard/     # KPI cards, ESG score gauges, notifications
        │   ├── environmental/ # Emissions, Energy, Waste tabs + forms
        │   ├── social/        # Wellbeing, CSR, Diversity tabs + forms
        │   ├── governance/    # Policies, Audits, Compliance tabs + forms
        │   ├── gamification/  # Leaderboard, Badges, Rewards, My Points
        │   ├── reports/       # Custom report builder, ESG summaries
        │   └── settings/      # ESG Config, Departments, Categories, User Management
        ├── shared/            # Reusable UI components, PageHeader, EmptyState, etc.
        └── app/               # Router, providers, layout shell
```

---

## 🧩 Key Features

### Environmental Module
- Log **Scope 1, 2, 3 carbon emissions** with source and date
- Track **energy consumption** by type (electricity, gas, renewable)
- Manage **waste data** (recycled, landfill, hazardous)
- **Carbon Transactions** with auto-calculated CO2e using emission factors

### Social Module
- **Employee Wellbeing** surveys with satisfaction scoring
- **CSR Initiatives** with evidence-gated approval workflows
- **Diversity Metrics** by department and period
- **Employee Participation** tracking with points awarding

### Governance Module
- **Policy Management** (draft → active → archived lifecycle)
- **Compliance Audits** with score and findings tracking
- **Board Activity** records with attendee management
- **Compliance Issues** with severity, due dates, and auto-notifications
- `is_overdue` computed property on all open issues past due date

### Gamification Module
- **Points Ledger** — every ESG action earns XP
- **Leaderboard** — company-wide rankings
- **Badges** — auto-awarded when point thresholds are crossed
- **Challenges** — structured challenges with evidence-gated approval
- **Rewards Store** — redeem XP for perks; stock-checked, atomic transactions

### Settings (Admin Only)
- **ESG Targets** — carbon, water, waste, diversity, governance targets
- **Score Thresholds** — Red/Amber/Green band configuration
- **Business Rule Toggles**:
  - `auto_emission_calculation` — auto-compute CO2e from emission factors
  - `require_evidence_csr` — block CSR approval without proof
  - `auto_award_badges` — auto-badge on XP milestone
  - `email_alerts_compliance` — notify admin when a compliance issue is created
- **Scoring Weights** — adjust E/S/G weight (must sum to 100%)
- **Departments** — full CRUD
- **Categories** — full CRUD
- **User Management** — change roles, activate/deactivate users

---

## 🔐 Security and Auth Architecture

| Feature | Detail |
|---|---|
| **JWT Access Token** | 30-minute expiry, signed with HS256 |
| **Refresh Token** | HttpOnly cookie, 7-day expiry |
| **Token Rotation** | Each refresh issues a new token pair (replay protection) |
| **Rate Limiting** | Login endpoint — blocks after repeated failures per IP+email |
| **RBAC** | Role-checked at both API route level and UI component level |
| **Password Reset** | Token-based, single-use, 15-minute expiry |

---

## 📡 API Reference Highlights

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Login, returns access token + sets refresh cookie |
| `POST` | `/api/v1/auth/refresh` | Rotate tokens |
| `GET` | `/api/v1/auth/users` | List all users (admin only) |
| `PATCH` | `/api/v1/auth/users/{id}` | Update user role / active status |
| `GET` | `/api/v1/environmental/emissions` | Paginated emissions list |
| `POST` | `/api/v1/environmental/emissions` | Create emission record |
| `POST` | `/api/v1/social/csr` | Create CSR initiative |
| `PATCH` | `/api/v1/social/participations/{id}` | Approve participation (evidence check) |
| `POST` | `/api/v1/governance/compliance-issues` | Create issue + trigger admin notification |
| `POST` | `/api/v1/gamification/rewards/redeem` | Redeem reward (points + stock check) |
| `GET` | `/api/v1/gamification/leaderboard` | Company leaderboard |
| `GET` | `/api/v1/settings` | Get company settings |
| `PUT` | `/api/v1/settings` | Update settings (targets, weights, toggles) |
| `GET` | `/api/v1/master/departments` | List departments |
| `POST` | `/api/v1/master/departments` | Create department |
| `GET` | `/api/v1/dashboard/summary` | Aggregated ESG KPIs |

> Full interactive API explorer at **http://localhost:8000/docs**

---

## 🎬 Evaluator Walkthrough Script

### 1. Login as Admin
- Open http://localhost:5173
- Login: `admin@ecosphere.com` / `Demo@1234`

### 2. Explore the Dashboard
- View **ESG Score gauges** (Environmental, Social, Governance)
- Check the **Notifications bell** in the top bar

### 3. Environmental — Log Emissions
- Navigate to **Environmental** → **Emissions** tab
- Click **Add Emission** — fill form (date, scope, source, value) → Submit
- Observe the record appear in the table

### 4. Social — Create CSR Initiative
- Navigate to **Social** → **CSR Initiatives** tab
- Click **Add CSR** — fill form → Submit
- Try approving a **Participation** without evidence — notice the validation block

### 5. Governance — Compliance Issue Alert
- Navigate to **Governance** → **Compliance Issues** tab
- Click **Add Issue** (severity: High, with a due date) → Submit
- Check **Notifications** — admin receives an auto-alert

### 6. Gamification — Leaderboard and Rewards
- Navigate to **Gamification** → **Leaderboard** to see points rankings
- Go to **My Points** → see your XP history
- Go to **Rewards** tab

### 7. Settings — Business Rules and User Management
- Navigate to **Settings** (bottom of sidebar)
- **ESG Configuration** — update carbon target, save
- **Departments** → **Add Department**
- **User Management** (Admin only) — change a user's role inline

### 8. Logout and Login as Different Roles
- Logout → Login as `env@ecosphere.com`
- Notice the **restricted navigation** — only Environmental-related modules accessible

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Make sure you're in /backend with venv active
pip install -r requirements.txt
python init_sqlite_db.py  # Reinitialize DB if needed
uvicorn app.main:app --reload --port 8000
```

### Frontend can't connect to backend
- Ensure backend is running on port `8000`
- Check `frontend/.env` has `VITE_API_BASE_URL=http://localhost:8000`

### "No data" / empty tables after login
```bash
# Reseed the database
cd backend
python init_sqlite_db.py
```

### Login fails with 400 CORS error
- Confirm backend `CORS_ORIGINS` in `.env` includes `http://localhost:5173`
- Restart the backend after changing `.env`

### Forgot password (hackathon mode)
- POST to `/api/v1/auth/forgot-password` with `{"email": "..."}`
- The reset token prints to the **backend server console** (no email server required)

---

## 📊 Data Model Overview

```
Users
  ├── PointsLedger (XP history)
  ├── Notification
  └── owns: Policy, ComplianceAudit, CSRInitiative

Companies
  ├── Facilities → EnergyUsage
  ├── CarbonEmission
  ├── WasteTracking
  └── EsgScoreSummary

Departments
  ├── Employees
  ├── DiversityMetric
  ├── DepartmentScore
  └── ComplianceIssue

Master Data
  ├── EmissionFactor (used in CarbonTransaction)
  ├── Category (used in CSRActivity, Challenge)
  ├── ProductESGProfile
  └── EnvironmentalGoal

Gamification
  ├── Badge (auto-awarded via XP milestones)
  ├── Challenge → ChallengeParticipation
  └── Reward (stock-controlled, redeemable)
```

---

## 🏆 Hackathon Highlights

| Feature | Implementation |
|---|---|
| **End-to-End CRUD** | All modules fully functional: create, read, update, delete |
| **Business Rules** | 7 settings-driven rules wired to real backend logic |
| **Auto CO2 Calculation** | CarbonTransaction multiplies quantity x EmissionFactor |
| **Evidence Gating** | CSR approvals blocked if proof missing (when toggle ON) |
| **Compliance Alerts** | Admin notified on new ComplianceIssue (settings-driven) |
| **Reward Redemption** | Atomic: checks stock + points, deducts both |
| **Dynamic Scoring Weights** | E/S/G score weighted by admin-configurable percentages |
| **RBAC** | 6 roles enforced at API + UI level |
| **Token Security** | Refresh token rotation + rate limiting |
| **Premium Design** | Glassmorphism, dark mode, micro-animations, responsive |

---

*Built with care for the Odoo Hackathon 2026 — EcoSphere Team*
