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
