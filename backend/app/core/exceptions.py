"""Custom exceptions for the application."""

from fastapi import HTTPException


class SummonerNotFound(HTTPException):
    """Raised when a summoner cannot be found."""

    def __init__(self, summoner_id: str):
        super().__init__(
            status_code=404,
            detail=f"Summoner '{summoner_id}' not found",
        )


class RateLimitExceeded(HTTPException):
    """Raised when Riot API rate limit is exceeded."""

    def __init__(self, retry_after: int = 60):
        super().__init__(
            status_code=429,
            detail=f"Rate limit exceeded. Retry after {retry_after} seconds",
            headers={"Retry-After": str(retry_after)},
        )


class RiotAPIError(HTTPException):
    """Raised when Riot API returns an error."""

    def __init__(self, status_code: int, message: str):
        super().__init__(
            status_code=status_code,
            detail=f"Riot API error: {message}",
        )


class NotInGame(HTTPException):
    """Raised when summoner is not in an active game."""

    def __init__(self, summoner_id: str):
        super().__init__(
            status_code=404,
            detail=f"Summoner '{summoner_id}' is not currently in a game",
        )


class InsufficientData(HTTPException):
    """Raised when there's not enough data for analysis."""

    def __init__(self, message: str = "Insufficient match history for analysis"):
        super().__init__(
            status_code=422,
            detail=message,
        )
