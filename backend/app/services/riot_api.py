"""Riot API client with rate limiting and error handling."""

import asyncio
import logging

import httpx

from app.config import get_settings
from app.core.exceptions import RateLimitExceeded, RiotAPIError, SummonerNotFound
from app.core.rate_limiter import rate_limiter
from app.schemas.match import LiveGameResponse, MatchResponse
from app.schemas.summoner import RankedEntry, RiotAccount, SummonerData

logger = logging.getLogger(__name__)
settings = get_settings()


class RiotAPIClient:
    """Async client for Riot Games API."""

    def __init__(self):
        """Initialize the API client."""
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create the HTTP client."""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                headers={
                    "X-Riot-Token": settings.RIOT_API_KEY,
                    "Accept": "application/json",
                },
                timeout=30.0,
            )
        return self._client

    async def close(self) -> None:
        """Close the HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def _request(
        self,
        method: str,
        url: str,
        retries: int = 3,
        **kwargs,
    ) -> dict:
        """Make a rate-limited request to Riot API with retry logic.

        Args:
            method: HTTP method
            url: Full URL to request
            retries: Number of retries for rate limit errors
            **kwargs: Additional arguments to pass to httpx

        Returns:
            JSON response as dict

        Raises:
            RateLimitExceeded: If rate limit is hit after all retries
            RiotAPIError: For other API errors
            SummonerNotFound: If summoner not found (404)
        """
        for attempt in range(retries + 1):
            # Wait for rate limit token
            wait_time = await rate_limiter.acquire()
            if wait_time > 0:
                logger.debug(f"Rate limited, waited {wait_time:.2f}s")

            client = await self._get_client()
            response = await client.request(method, url, **kwargs)

            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                raise SummonerNotFound(url.split("/")[-1])
            elif response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 10))
                # Set global backoff so ALL requests wait
                rate_limiter.set_backoff(retry_after)
                if attempt < retries:
                    logger.warning(f"Rate limit hit, global backoff for {retry_after}s, retry {attempt + 1}/{retries}")
                    await asyncio.sleep(retry_after)
                    continue
                else:
                    logger.error(f"Rate limit exceeded after {retries} retries")
                    raise RateLimitExceeded(retry_after)
            else:
                error_msg = response.text[:200]
                logger.error(f"Riot API error {response.status_code}: {error_msg}")
                raise RiotAPIError(response.status_code, error_msg)

        # Should not reach here, but just in case
        raise RiotAPIError(500, "Request failed after retries")

    # Account endpoints (Regional)
    async def get_account_by_riot_id(
        self, game_name: str, tag_line: str
    ) -> RiotAccount:
        """Get account by Riot ID (name#tag).

        Args:
            game_name: The game name part of Riot ID
            tag_line: The tag part of Riot ID (without #)

        Returns:
            RiotAccount with puuid, game_name, tag_line
        """
        url = f"{settings.REGIONAL_HOST}/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
        data = await self._request("GET", url)
        return RiotAccount.model_validate(data)

    # Summoner endpoints (Platform)
    async def get_summoner_by_puuid(self, puuid: str) -> SummonerData:
        """Get summoner details by PUUID.

        Args:
            puuid: Player Universally Unique ID

        Returns:
            SummonerData with summoner details
        """
        url = f"{settings.PLATFORM_HOST}/lol/summoner/v4/summoners/by-puuid/{puuid}"
        data = await self._request("GET", url)
        return SummonerData.model_validate(data)

    # League endpoints (Platform)
    async def get_ranked_entries(self, puuid: str) -> list[RankedEntry]:
        """Get ranked entries for a summoner.

        Args:
            puuid: Player PUUID

        Returns:
            List of RankedEntry (solo/duo, flex, etc.)
        """
        url = f"{settings.PLATFORM_HOST}/lol/league/v4/entries/by-puuid/{puuid}"
        data = await self._request("GET", url)
        return [RankedEntry.model_validate(entry) for entry in data]

    # Spectator endpoints (Platform)
    async def get_live_game(self, puuid: str) -> LiveGameResponse:
        """Get active game for a summoner.

        Args:
            puuid: Player PUUID

        Returns:
            LiveGameResponse with game details

        Raises:
            SummonerNotFound: If player is not in a game
        """
        url = f"{settings.PLATFORM_HOST}/lol/spectator/v5/active-games/by-summoner/{puuid}"
        data = await self._request("GET", url)
        return LiveGameResponse.model_validate(data)

    # Match endpoints (Regional)
    async def get_match_ids(
        self,
        puuid: str,
        start: int = 0,
        count: int = 20,
        queue: int | None = None,
    ) -> list[str]:
        """Get match IDs for a player.

        Args:
            puuid: Player PUUID
            start: Start index for pagination
            count: Number of matches to fetch (max 100)
            queue: Optional queue ID filter (420=ranked solo, 440=ranked flex)

        Returns:
            List of match IDs
        """
        url = f"{settings.REGIONAL_HOST}/lol/match/v5/matches/by-puuid/{puuid}/ids"
        params = {"start": start, "count": min(count, 100)}
        if queue:
            params["queue"] = queue
        data = await self._request("GET", url, params=params)
        return data

    async def get_match(self, match_id: str) -> MatchResponse:
        """Get match details by ID.

        Args:
            match_id: Match ID (e.g., "NA1_1234567890")

        Returns:
            MatchResponse with full match data
        """
        url = f"{settings.REGIONAL_HOST}/lol/match/v5/matches/{match_id}"
        data = await self._request("GET", url)
        return MatchResponse.model_validate(data)


# Global client instance
riot_api = RiotAPIClient()
