# BarberPro Server

A minimal Node.js + Express + MongoDB backend for BarberPro.

## Setup

1. Install Node.js 18+ and MongoDB (local or Atlas).
2. In PowerShell:

```powershell
cd server
npm install express mongoose dotenv cors
Copy-Item .env.example .env
```

3. Edit `.env` to set your `MONGODB_URI` if needed.

## Run

```powershell
cd server
npm start
```

Production: open `https://heritageblade.bario.me/` — the front-end is served from your subdomain and POSTs to `/api/bookings` persist in MongoDB.

Local dev (optional): open `http://127.0.0.1:3000`.

## Test API

```powershell
Invoke-RestMethod -Method Post -Uri https://heritageblade.bario.me/api/bookings -ContentType 'application/json' -Body '{
  "name": "Test User",
  "phone": "+254700000000",
  "email": "test@example.com",
  "service": "Fade",
  "date": "2026-02-01",
  "time": "10:00",
  "notes": "Prefers low fade"
}'
```

This maps `notes` to the `comment` field in MongoDB.
