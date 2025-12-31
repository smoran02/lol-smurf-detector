# LoL Smurf Detector - Project Context

## Overview
A web application that detects smurf accounts in League of Legends matches by analyzing player statistics and behavior patterns. Users enter their Riot ID, and the app analyzes all players in their current live game.

**Status:** Proof of concept - deployed on Render, needs production API key for full functionality

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, TailwindCSS v4 |
| Backend | FastAPI, Python 3.11+, async/await |
| External API | Riot Games API (League of Legends) |
| Deployment | Render (auto-deploy via GitHub Actions) |

## Project Structure

```
lol-smurf-detector/
├── frontend/                 # Next.js frontend
│   └── src/
│       ├── app/              # Pages and layouts
│       ├── components/       # React components
│       │   ├── match/        # LiveMatchCard
│       │   ├── player/       # PlayerCard, SmurfIndicator, StreamerModeCard
│       │   └── search/       # SummonerSearch
│       ├── hooks/            # React Query hooks
│       └── lib/              # API client, champion data mappings
├── backend/                  # FastAPI backend
│   └── app/
│       ├── api/v1/           # API routes (summoner, match, analysis)
│       ├── algorithms/       # Smurf detection logic
│       ├── services/         # Riot API client, position inference
│       └── schemas/          # Pydantic models
└── .github/workflows/        # CI/CD pipeline
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/.env` | API keys (RIOT_API_KEY) - never commit |
| `backend/app/algorithms/smurf_detector.py` | Core detection scoring logic |
| `backend/app/services/riot_api.py` | Riot API client with rate limiting |
| `backend/app/api/v1/analysis.py` | Match analysis endpoint, streamer mode handling |
| `frontend/src/lib/api.ts` | Frontend API client, champion ID mappings |
| `frontend/src/app/globals.css` | Design system (Neon Detective theme) |

## Running Locally

```bash
# Backend (requires .env with RIOT_API_KEY)
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Smurf Detection Algorithm

Analyzes 7 indicators, each scored 0-100:
1. **Win Rate** - High win rate on new account
2. **Level vs Performance** - Low level but high skill metrics
3. **Champion Pool** - Small pool with high mastery
4. **CS/min** - Creep score efficiency
5. **KDA** - Kill/Death/Assist ratio
6. **Game Frequency** - Games per day pattern
7. **Account Age Ratio** - Account age vs games played

**Classifications:** LIKELY_SMURF (70+), POSSIBLE_SMURF (50-70), UNLIKELY (<30), UNKNOWN

## Special Features

- **Streamer Mode Support**: Players with privacy settings enabled appear with champion info but hidden identity
- **Position Inference**: Automatically detects player positions based on champion and summoner spells

## Current Limitations

- Dev API key expires every 24 hours (need production key)
- Rate limits: 20 req/sec, 100 req/2min
- Algorithm weights need tuning with more data
