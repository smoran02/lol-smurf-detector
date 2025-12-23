# League of Legends Smurf Detector - Implementation Plan

## Overview
A web application where users enter their summoner name, view their current match, and see smurf analysis for all players.

**Tech Stack:** FastAPI (backend) + Next.js (frontend) + PostgreSQL

---

## Project Structure

```
lol-smurf-detector/
├── backend/                     # FastAPI
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings (API key, DB URL)
│   │   ├── api/v1/
│   │   │   ├── summoner.py      # Summoner lookup endpoints
│   │   │   ├── match.py         # Live match endpoints
│   │   │   └── analysis.py      # Smurf analysis endpoints
│   │   ├── services/
│   │   │   ├── riot_api.py      # Riot API client with rate limiting
│   │   │   └── cache_service.py # Database caching logic
│   │   ├── algorithms/
│   │   │   └── smurf_detector.py # Core detection algorithm
│   │   ├── models/
│   │   │   └── database.py      # SQLAlchemy models
│   │   └── db/
│   │       └── session.py       # Database connection
│   ├── tests/                   # Backend tests
│   │   ├── conftest.py          # Pytest fixtures
│   │   ├── test_smurf_detector.py
│   │   ├── test_riot_api.py
│   │   └── test_api_endpoints.py
│   ├── requirements.txt
│   └── alembic/                 # Migrations
│
├── frontend/                    # Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Home/search page
│   │   │   └── match/[gameId]/page.tsx  # Live match analysis
│   │   ├── components/
│   │   │   ├── SummonerSearch.tsx
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── SmurfIndicator.tsx
│   │   │   └── LiveMatchCard.tsx
│   │   ├── hooks/
│   │   │   └── useSmurfAnalysis.ts
│   │   └── lib/
│   │       └── api.ts           # API client
│   ├── __tests__/               # Frontend tests
│   │   └── components/
│   ├── e2e/                     # Playwright E2E tests
│   └── package.json
│
├── docs/
│   └── IMPLEMENTATION_PLAN.md   # Permanent plan copy
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI
├── CLAUDE.md                    # General best practices
├── CLAUDE-PROJECT.md            # Project-specific guidance
├── docker-compose.yml
├── .gitignore
└── .env.example
```

---

## Database Schema (PostgreSQL)

**Key Tables:**

1. **summoners** - Cached summoner data (puuid, riot_id, level, rank data)
2. **player_match_stats** - Per-player match stats (KDA, CS, gold, etc.)
3. **smurf_analyses** - Analysis results (scores, indicators, classification)
4. **rate_limit_tracker** - API rate limit management

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/summoner/by-riot-id/{name}/{tag}` | Find summoner by Riot ID |
| GET | `/api/v1/match/live/{puuid}` | Get current live match |
| POST | `/api/v1/analysis/player` | Analyze single player |
| POST | `/api/v1/analysis/match` | Analyze all 10 players in match |

---

## Riot API Endpoints Needed

| Endpoint | Purpose |
|----------|---------|
| `/riot/account/v1/accounts/by-riot-id/{name}/{tag}` | Get PUUID from Riot ID |
| `/lol/summoner/v4/summoners/by-puuid/{puuid}` | Get summoner details |
| `/lol/league/v4/entries/by-summoner/{id}` | Get ranked data |
| `/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}` | Get mastery |
| `/lol/spectator/v5/active-games/by-summoner/{puuid}` | Get live game |
| `/lol/match/v5/matches/by-puuid/{puuid}/ids` | Get match history IDs |
| `/lol/match/v5/matches/{matchId}` | Get match details |

**Rate Limits (Dev Key):** 20 requests/sec, 100 requests/2min

---

## Smurf Detection Algorithm

**Indicators (weighted scoring 0-100):**

| Indicator | Weight | Description |
|-----------|--------|-------------|
| Win Rate | 20% | High win rate (>65%) on new accounts |
| Level vs Performance | 20% | Low level but high-tier performance |
| Champion Pool | 15% | One-tricking or very few champions |
| CS/min | 15% | CS significantly above rank average |
| KDA | 10% | KDA above rank benchmark |
| Game Frequency | 10% | Many games/day on new account |
| Account Age Ratio | 10% | Reached rank too quickly |

**Classification:**
- **LIKELY_SMURF:** Score >= 70
- **POSSIBLE_SMURF:** Score 50-69
- **UNLIKELY:** Score < 50
- **UNKNOWN:** Insufficient data (<5 games)

**Tier Benchmarks (for comparison):**
```
IRON:   CS 4.0/min, KDA 1.5
BRONZE: CS 5.0/min, KDA 1.8
SILVER: CS 5.5/min, KDA 2.0
GOLD:   CS 6.0/min, KDA 2.3
PLAT:   CS 6.5/min, KDA 2.6
...
```

---

## Implementation Steps

### Phase 0: Project Setup
1. Create `lol-smurf-detector/` folder in current directory
2. Initialize Git repository (`git init`)
3. Create GitHub repository and link remote
4. Create `CLAUDE.md` - general best practices (PEP8, type hints, docstrings, no exposed secrets, etc.)
5. Create `CLAUDE-PROJECT.md` - project-specific guidance (architecture, API patterns, naming conventions)
6. Create `docs/IMPLEMENTATION_PLAN.md` - copy of this plan for reference
7. Set up GitHub Issues for tracking milestones (one issue per phase)

### Phase 1: Backend Foundation
8. Set up FastAPI project structure with PostgreSQL
9. Create SQLAlchemy models and run migrations
10. Implement Riot API client with rate limiting
11. Create `/summoner/by-riot-id` endpoint
12. Write unit tests for Riot API client (mocked responses)

### Phase 2: Core Analysis
13. Implement match history fetching service
14. Implement `/match/live/{puuid}` endpoint
15. Build smurf detection algorithm
16. Create `/analysis/player` endpoint
17. Create `/analysis/match` endpoint for all 10 players
18. Write unit tests for smurf detection algorithm
19. Write integration tests for API endpoints

### Phase 3: Frontend
20. Set up Next.js project with Tailwind
21. **Use `/frontend-design` skill** to generate UI designs for:
    - SummonerSearch component
    - PlayerCard with SmurfIndicator
    - LiveMatchCard with team display
22. Implement generated designs
23. Connect to backend API
24. Write component tests (React Testing Library)

### Phase 4: Polish & Testing
25. Add caching layer for API responses
26. Add error handling and loading states
27. Style UI with color-coded smurf scores
28. Add Docker Compose for local dev
29. Write E2E tests (Playwright)
30. Set up CI/CD with GitHub Actions (run tests on PR)

---

## Prerequisites

1. **Register for Riot API Key** at https://developer.riotgames.com
   - Development key: 20 req/sec, 100 req/2min
   - Production key: Apply after building prototype

2. **Install:**
   - Python 3.11+
   - Node.js 18+
   - PostgreSQL 15+
   - Docker (optional)

---

## Key Dependencies

**Backend (Python):**
- fastapi, uvicorn
- sqlalchemy[asyncio], asyncpg, alembic
- httpx (async HTTP client)
- pydantic-settings

**Frontend (Node):**
- next 14, react 18
- @tanstack/react-query
- tailwindcss
- recharts (for visualizations)

---

## Testing Strategy

**Backend Tests (`backend/tests/`):**
- **Unit tests:** pytest + pytest-asyncio
  - `test_smurf_detector.py` - Algorithm scoring logic
  - `test_riot_api.py` - API client with mocked responses (httpx mock)
  - `test_metrics.py` - Metrics calculation
- **Integration tests:** TestClient + test database
  - `test_api_summoner.py` - Summoner endpoints
  - `test_api_analysis.py` - Analysis endpoints

**Frontend Tests (`frontend/__tests__/`):**
- **Component tests:** Jest + React Testing Library
  - `PlayerCard.test.tsx`
  - `SmurfIndicator.test.tsx`
  - `SummonerSearch.test.tsx`
- **E2E tests:** Playwright
  - `search-flow.spec.ts` - Full search to results flow

**CI/CD:** GitHub Actions workflow runs tests on every PR

---

## Documentation & Plan Storage

The implementation plan will be stored in multiple locations:

1. **`docs/IMPLEMENTATION_PLAN.md`** - Permanent copy in the repo (survives session termination)
2. **GitHub Issues** - One issue per phase for tracking progress
3. **Git commits** - Each significant change documented with descriptive commit messages

This ensures the plan is always available even if the Claude session ends
