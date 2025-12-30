# LoL Smurf Detector - Project Context

## Overview
A web application that detects smurf accounts in League of Legends matches by analyzing player statistics and behavior patterns. Users enter their Riot ID, and the app analyzes all players in their current live game.

**Status:** Proof of concept - algorithm needs refinement with more data access (requires production API key)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, TailwindCSS v4 |
| Backend | FastAPI, Python 3.11+, async/await |
| Database | PostgreSQL with SQLAlchemy (async) |
| External API | Riot Games API (League of Legends) |
| Deployment | Docker, Docker Compose |

## Project Structure

```
lol-smurf-detector/
├── frontend/                 # Next.js frontend
│   └── src/
│       ├── app/              # Pages and layouts
│       ├── components/       # React components
│       │   ├── match/        # LiveMatchCard
│       │   ├── player/       # PlayerCard, SmurfIndicator
│       │   └── search/       # SummonerSearch
│       ├── hooks/            # React Query hooks
│       └── lib/              # API client, utilities
├── backend/                  # FastAPI backend
│   └── app/
│       ├── api/v1/           # API routes (summoner, match, analysis)
│       ├── algorithms/       # Smurf detection logic
│       ├── services/         # Riot API client, rate limiting
│       ├── models/           # SQLAlchemy models
│       └── config.py         # Environment configuration
└── docker-compose.yml        # Container orchestration
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/.env` | API keys and config (RIOT_API_KEY, DATABASE_URL) |
| `backend/app/algorithms/` | Smurf detection scoring logic |
| `backend/app/services/riot_api.py` | Riot API client with rate limiting |
| `frontend/src/lib/api.ts` | Frontend API client, champion data |
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
3. **Champion Pool** - Small pool with high mastery (one-tricks)
4. **CS/min** - Creep score efficiency
5. **KDA** - Kill/Death/Assist ratio
6. **Game Frequency** - Games per day pattern
7. **Account Age Ratio** - Account age vs games played

**Classifications:** LIKELY_SMURF (70+), POSSIBLE_SMURF (50-70), UNLIKELY (<30), UNKNOWN

## Current Limitations

- Dev API key expires every 24 hours (need production key)
- Rate limits: 20 req/sec, 100 req/2min
- Algorithm weights need tuning with more data
- No historical data collection yet

## Next Steps

1. Add legal pages (Privacy Policy, Terms, Riot attribution)
2. Deploy publicly (Vercel + Railway)
3. Apply for Riot production API key
4. Gather data to improve detection algorithm

---

# General Development Best Practices

This document contains general coding standards and best practices applicable across multiple projects.

## Python Standards

### Code Style
- Follow PEP 8 style guidelines
- Use 4 spaces for indentation (no tabs)
- Maximum line length: 88 characters (Black formatter default)
- Use meaningful variable and function names (snake_case)
- Class names in PascalCase

### Type Hints
- Always use type hints for function parameters and return values
- Use `Optional[T]` for nullable types
- Use `List`, `Dict`, `Tuple` from `typing` module for Python < 3.9
- Use built-in generics (`list[str]`, `dict[str, int]`) for Python 3.9+

```python
# Good
def get_user_by_id(user_id: int) -> Optional[User]:
    ...

# Bad
def get_user_by_id(user_id):
    ...
```

### Docstrings
- Use docstrings for all public modules, functions, classes, and methods
- Follow Google-style docstrings format
- Include Args, Returns, and Raises sections where applicable

```python
def calculate_score(metrics: PlayerMetrics, weights: dict[str, float]) -> float:
    """Calculate weighted smurf score from player metrics.

    Args:
        metrics: Player performance metrics to evaluate.
        weights: Weight multipliers for each metric category.

    Returns:
        A float between 0 and 100 representing the smurf likelihood score.

    Raises:
        ValueError: If weights don't sum to 1.0.
    """
    ...
```

### Error Handling
- Use specific exception types, not bare `except:`
- Create custom exceptions for domain-specific errors
- Log exceptions with appropriate context
- Don't silently swallow exceptions

```python
# Good
try:
    result = api_client.get_data()
except RateLimitError as e:
    logger.warning(f"Rate limited, retrying in {e.retry_after}s")
    await asyncio.sleep(e.retry_after)
except APIError as e:
    logger.error(f"API error: {e}")
    raise

# Bad
try:
    result = api_client.get_data()
except:
    pass
```

## JavaScript/TypeScript Standards

### Code Style
- Use TypeScript for all new code
- Use 2 spaces for indentation
- Use semicolons
- Prefer `const` over `let`, avoid `var`
- Use meaningful names (camelCase for variables/functions, PascalCase for components/classes)

### Type Safety
- Avoid `any` type - use `unknown` if type is truly unknown
- Define interfaces for all data structures
- Use strict TypeScript configuration

```typescript
// Good
interface Player {
  puuid: string;
  riotId: string;
  level: number;
}

function getPlayer(puuid: string): Promise<Player> {
  ...
}

// Bad
function getPlayer(puuid: any): any {
  ...
}
```

### React Best Practices
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

## Security

### CRITICAL: Never Expose Secrets
- **NEVER** commit API keys, passwords, or tokens to git
- **NEVER** hardcode secrets in source code
- Use environment variables for all sensitive configuration
- Add `.env` files to `.gitignore`
- Use `.env.example` to document required variables (without values)

```python
# Good
import os
API_KEY = os.environ.get("RIOT_API_KEY")

# Bad - NEVER DO THIS
API_KEY = "RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Input Validation
- Validate all user input on both client and server
- Use parameterized queries for database operations (SQLAlchemy handles this)
- Sanitize data before rendering in UI to prevent XSS
- Implement rate limiting on public endpoints

### Dependencies
- Keep dependencies updated
- Review security advisories
- Use lock files (requirements.txt with versions, package-lock.json)

## Testing

### Test Coverage
- Write tests for all business logic
- Aim for high coverage on critical paths
- Test edge cases and error conditions

### Test Organization
- Unit tests: Test individual functions/methods in isolation
- Integration tests: Test API endpoints with real database
- E2E tests: Test full user flows in browser

### Test Naming
- Use descriptive test names that explain what is being tested
- Follow pattern: `test_<function>_<scenario>_<expected_result>`

```python
def test_calculate_score_high_winrate_returns_high_score():
    ...

def test_calculate_score_insufficient_games_returns_unknown():
    ...
```

## Git Practices

### Commits
- Write clear, descriptive commit messages
- Use present tense ("Add feature" not "Added feature")
- Keep commits focused on single changes
- Reference issue numbers where applicable

```
# Good
Add smurf detection algorithm with weighted scoring

Implements the core detection logic using 7 weighted indicators:
- Win rate analysis
- Level vs performance comparison
- Champion pool concentration
...

Closes #5

# Bad
fixed stuff
```

### Branches
- Use feature branches for new work
- Name branches descriptively: `feature/smurf-detection`, `fix/rate-limiting`
- Keep branches up to date with main
- Delete branches after merging

## Code Organization

### File Structure
- One class/component per file (generally)
- Group related files in directories
- Use index files for clean exports
- Keep files under 300 lines when possible

### Dependencies
- Import only what you need
- Avoid circular dependencies
- Use dependency injection for testability
