# EcoSphere

A production-quality ESG (Environmental, Social, Governance) Management Platform built for the Odoo Hackathon 2026.

## Stack
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI (Python 3.11), SQLAlchemy 2.0 (async), Alembic, Pydantic v2, PostgreSQL 15
- **Deployment**: Docker, Docker Compose

## Getting Started

To run the application locally:

```bash
cp .env.example .env
docker compose up --build
```

- Backend API: http://localhost:8000
- Frontend: http://localhost:5173
