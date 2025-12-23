# LoL Smurf Detector - Project Guidelines

This document contains project-specific architecture decisions, patterns, and conventions for the League of Legends Smurf Detector application.

## Project Overview

A web application that detects smurf accounts in League of Legends matches. Users enter their summoner name, and the app analyzes all players in their current match to identify likely smurfs.

## Architecture

### Tech Stack
- **Backend:** FastAPI (Python 3.11+)
- **Frontend:** Next.js 14 (App Router) with TypeScript
- **Database:** PostgreSQL
- **API Integration:** Riot Games API

### Project Structure

```
lol-smurf-detector/
├── backend/           # FastAPI application
├── frontend/          # Next.js application
├── docs/              # Documentation
└── docker-compose.yml # Local development setup
```

## Backend Conventions

### API Versioning
All API routes are versioned under `/api/v1/`:
```
/api/v1/summoner/...
/api/v1/match/...
/api/v1/analysis/...
```

### Service Layer Pattern
- **API routes** handle HTTP request/response
- **Services** contain business logic
- **Models** define database schema
- **Schemas** define request/response shapes (Pydantic)

```python
# Route -> Service -> Model pattern
@router.get("/summoner/{puuid}")
async def get_summoner(puuid: str, service: SummonerService = Depends()):
    return await service.get_by_puuid(puuid)
```

### Async/Await
- All database operations use async SQLAlchemy
- All HTTP requests use async httpx
- Use `async def` for all route handlers and service methods

### Error Handling
Custom exceptions in `app/core/exceptions.py`:
```python
class SummonerNotFound(HTTPException):
    def __init__(self, summoner_id: str):
        super().__init__(status_code=404, detail=f"Summoner {summoner_id} not found")

class RateLimitExceeded(HTTPException):
    def __init__(self, retry_after: int):
        super().__init__(status_code=429, detail=f"Rate limited. Retry after {retry_after}s")
```

### Configuration
Use pydantic-settings for configuration:
```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    RIOT_API_KEY: str
    DATABASE_URL: str

    class Config:
        env_file = ".env"
```

## Riot API Integration

### Rate Limiting
- Development key: 20 requests/second, 100 requests/2 minutes
- Always respect rate limits to avoid API key revocation
- Use token bucket algorithm in `app/core/rate_limiter.py`

### API Hosts
```python
PLATFORM_HOST = "https://na1.api.riotgames.com"  # NA region
REGIONAL_HOST = "https://americas.api.riotgames.com"  # Americas routing
```

### Caching Strategy
- Cache summoner data for 1 hour
- Cache rank data for 30 minutes
- Cache match data permanently (matches don't change)
- Cache smurf analysis for 2 hours

## Smurf Detection Algorithm

### Scoring System
- Each indicator scores 0-100
- Final score is weighted average
- Classification thresholds:
  - `LIKELY_SMURF`: >= 70
  - `POSSIBLE_SMURF`: 50-69
  - `UNLIKELY`: < 50
  - `UNKNOWN`: Insufficient data

### Indicators and Weights
| Indicator | Weight | Description |
|-----------|--------|-------------|
| winrate | 0.20 | Win rate vs expected for account age |
| level_performance | 0.20 | Account level vs rank achieved |
| champion_pool | 0.15 | Number of unique champions played |
| cs_per_min | 0.15 | CS/min vs rank benchmark |
| kda | 0.10 | KDA vs rank benchmark |
| game_frequency | 0.10 | Games per day on new account |
| account_age_ratio | 0.10 | Days to reach current rank |

### Benchmark Data
Located in `app/algorithms/thresholds.py`:
```python
TIER_BENCHMARKS = {
    "IRON": {"cs": 4.0, "kda": 1.5},
    "BRONZE": {"cs": 5.0, "kda": 1.8},
    # ...
}
```

## Frontend Conventions

### Component Organization
```
components/
├── ui/           # Reusable UI primitives (Button, Card, etc.)
├── search/       # Search-related components
├── match/        # Match display components
└── player/       # Player card components
```

### Data Fetching
Use TanStack Query for server state:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['summoner', riotId],
  queryFn: () => api.getSummoner(riotId),
});
```

### API Client
Centralized in `lib/api.ts`:
```typescript
const api = {
  getSummoner: (name: string, tag: string) =>
    fetch(`/api/v1/summoner/by-riot-id/${name}/${tag}`).then(r => r.json()),
  // ...
};
```

### Styling
- Use Tailwind CSS for all styling
- Use shadcn/ui components as base
- Color scheme for smurf scores:
  - Green: 0-30 (unlikely)
  - Yellow: 30-50 (low suspicion)
  - Orange: 50-70 (possible smurf)
  - Red: 70-100 (likely smurf)

## Database Conventions

### Naming
- Tables: plural snake_case (`summoners`, `match_history`)
- Columns: singular snake_case (`summoner_id`, `created_at`)
- Foreign keys: `<referenced_table_singular>_id`

### Timestamps
All tables should include:
```python
created_at = Column(DateTime(timezone=True), server_default=func.now())
updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### Migrations
Use Alembic for all schema changes:
```bash
alembic revision --autogenerate -m "Add summoners table"
alembic upgrade head
```

## Testing Conventions

### Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_smurf_detector.py
```

### Mocking Riot API
Use httpx mock for API tests:
```python
@pytest.fixture
def mock_riot_api(httpx_mock):
    httpx_mock.add_response(
        url="https://na1.api.riotgames.com/lol/summoner/v4/...",
        json={"puuid": "test-puuid", ...}
    )
```

### Frontend Tests
```bash
# Run component tests
npm test

# Run E2E tests
npx playwright test
```

## Environment Variables

Required variables (see `.env.example`):
```
# Backend
RIOT_API_KEY=           # Riot Games API key
DATABASE_URL=           # PostgreSQL connection string

# Frontend
NEXT_PUBLIC_API_URL=    # Backend API URL
```

## Running Locally

### With Docker
```bash
docker-compose up
```

### Without Docker
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Common Tasks

### Adding a New API Endpoint
1. Define Pydantic schemas in `schemas/`
2. Add service method in `services/`
3. Create route in `api/v1/`
4. Write tests in `tests/`

### Adding a New Smurf Indicator
1. Add indicator method in `algorithms/smurf_detector.py`
2. Update weights in `algorithms/weights.py`
3. Add tests for new indicator
4. Update API response schema if needed

### Updating Database Schema
1. Modify models in `models/`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review generated migration
4. Apply: `alembic upgrade head`
