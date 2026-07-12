# EcoSphere Global ESG Management Platform

A production-quality ESG (Environmental, Social, Governance) Management Platform built for the Odoo Hackathon 2026. This platform allows enterprises to track, manage, and gamify their sustainability initiatives.

## 🚀 Project Overview

EcoSphere is designed for modern organizations to seamlessly track carbon emissions, manage social initiatives, ensure governance compliance, and drive employee engagement through gamification.

### Key Modules:
- **Environmental**: Scope 1, 2, and 3 emissions tracking, energy consumption, and waste management.
- **Social**: Diversity metrics, employee wellbeing surveys, and CSR initiatives.
- **Governance**: Policy management, compliance audits, and board activities.
- **Gamification**: Points ledger, badges, and leaderboards to incentivize ESG compliance across the organization.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI (Python 3.11), SQLAlchemy 2.0 (async), Alembic, Pydantic v2
- **Database**: PostgreSQL 15 (Docker)
- **Deployment**: Docker, Docker Compose

## 📦 Getting Started

To run the application locally from a clean clone:

```bash
# 1. Clone the repository
git clone <repo-url>
cd ecosphere-esg-platform

# 2. Configure environment variables
cp .env.example .env

# 3. Build and run via Docker Compose
docker compose up --build
```

- **Backend API**: `http://localhost:8000` (Swagger UI: `http://localhost:8000/docs`)
- **Frontend**: `http://localhost:5173`

*Note: The backend automatically runs database migrations and seeds the database with realistic enterprise data on startup.*

## 🎬 Demo Script (Hackathon Presentation)

1. **Login**: 
   - Start by logging in as `employee@ecosphere.com` (Password: `Demo@1234`).
   - Notice the intuitive, responsive dashboard.
2. **Dashboard**:
   - Showcase the aggregated ESG scores and recent notifications.
3. **Gamification**:
   - Navigate to the Gamification module. 
   - View the leaderboard and badge unlocks (e.g., "Eco Warrior").
4. **Environmental**:
   - Switch to `env@ecosphere.com` to demonstrate tracking Scope 1 & 2 emissions and energy usage.
5. **Governance**:
   - Login as `admin@ecosphere.com` to review Compliance Audits and Policy states.
6. **Dark Mode & Responsive UI**:
   - Toggle the Dark Mode switch and show how the application scales seamlessly to mobile views.

## 🔐 Authentication & Security
- **Refresh Token Rotation**: Implemented to prevent token replay attacks.
- **Rate Limiting**: Protects login endpoints against brute-force attacks.
- **RBAC**: Fine-grained Role-Based Access Control enforced at both API and UI levels.
