"""Summoner lookup API endpoints."""

import logging

from fastapi import APIRouter

from app.schemas.summoner import SummonerResponse
from app.services.riot_api import riot_api

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/by-riot-id/{name}/{tag}", response_model=SummonerResponse)
async def get_summoner_by_riot_id(name: str, tag: str) -> SummonerResponse:
    """Look up a summoner by their Riot ID.

    Args:
        name: Game name portion of Riot ID
        tag: Tag portion of Riot ID (without #)

    Returns:
        Full summoner information including ranked data
    """
    # Get account info (PUUID) from Riot ID
    account = await riot_api.get_account_by_riot_id(name, tag)

    # Get summoner details using PUUID
    summoner = await riot_api.get_summoner_by_puuid(account.puuid)

    # Get ranked entries using PUUID
    solo_data = {}
    flex_data = {}
    ranked_entries = await riot_api.get_ranked_entries(account.puuid)

    # Parse ranked data
    for entry in ranked_entries:
        if entry.queue_type == "RANKED_SOLO_5x5":
            solo_data = {
                "solo_tier": entry.tier,
                "solo_rank": entry.rank,
                "solo_lp": entry.league_points,
                "solo_wins": entry.wins,
                "solo_losses": entry.losses,
            }
        elif entry.queue_type == "RANKED_FLEX_SR":
            flex_data = {
                "flex_tier": entry.tier,
                "flex_rank": entry.rank,
                "flex_lp": entry.league_points,
                "flex_wins": entry.wins,
                "flex_losses": entry.losses,
            }

    return SummonerResponse(
        puuid=account.puuid,
        summoner_id=summoner.id,
        riot_id_name=account.game_name,
        riot_id_tag=account.tag_line,
        summoner_level=summoner.summoner_level,
        profile_icon_id=summoner.profile_icon_id,
        **solo_data,
        **flex_data,
    )
