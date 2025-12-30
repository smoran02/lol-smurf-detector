"""Live match API endpoints."""

import logging

from fastapi import APIRouter, HTTPException

from app.core.exceptions import SummonerNotFound
from app.schemas.match import LiveGameResponse
from app.services.riot_api import riot_api

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/live/{puuid}", response_model=LiveGameResponse)
async def get_live_match(puuid: str) -> LiveGameResponse:
    """Get the current live match for a player.

    Args:
        puuid: Player PUUID

    Returns:
        Live game data including all participants

    Raises:
        404: Player is not currently in a game
    """
    try:
        live_game = await riot_api.get_live_game(puuid)
        return live_game
    except SummonerNotFound:
        raise HTTPException(
            status_code=404,
            detail="Player is not currently in a game",
        )
