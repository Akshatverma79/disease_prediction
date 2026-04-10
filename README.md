# Disease Prediction Web App

An end-to-end ML project for educational use.

- Backend: FastAPI (`backend/`)
- Frontend: Next.js (`frontend/`)
- Deployment guide: `DEPLOYMENT.md`

## Local Development

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### Frontend

```powershell
cd frontend
pnpm install
pnpm dev
```

Frontend runs at `http://localhost:3000`.

## Required Environment Variables

### Backend (`backend/.env`)

See `backend/.env.example`.

### Frontend (`frontend/.env.local`)

See `frontend/.env.example`.

## Deployment

Follow `DEPLOYMENT.md` for Render + Vercel hosting.

## API Endpoints

- `GET /`
- `GET /health`
- `GET /symptoms`
- `POST /predict`

## Disclaimer

This project is not a medical diagnosis system. Use it only for educational or research demonstration purposes.
