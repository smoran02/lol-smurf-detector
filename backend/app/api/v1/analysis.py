"""Smurf analysis API endpoints."""

import asyncio
import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.algorithms.smurf_detector import smurf_detector
from app.core.exceptions import SummonerNotFound
from app.schemas.analysis import (
    HiddenPlayer,
    IndicatorScores,
    MatchAnalysisResponse,
    Position,
    RawMetrics,
    SmurfAnalysisResponse,
    SmurfClassification,
)
from app.services.match_service import match_service
from app.services.position_inference import infer_position, infer_team_positions
from app.services.riot_api import riot_api

logger = logging.getLogger(__name__)

router = APIRouter()

# Queue ID to display name mapping
QUEUE_NAMES = {
    420: "Ranked Solo/Duo",
    440: "Ranked Flex",
    400: "Normal Draft",
    430: "Normal Blind",
    450: "ARAM",
    700: "Clash",
    830: "Co-op vs AI (Intro)",
    840: "Co-op vs AI (Beginner)",
    850: "Co-op vs AI (Intermediate)",
    900: "ARURF",
    1020: "One for All",
    1300: "Nexus Blitz",
    1400: "Ultimate Spellbook",
    1700: "Arena",
    1900: "URF",
}


def get_queue_name(queue_id: int, game_mode: str) -> str:
    """Get human-readable queue name from queue ID."""
    return QUEUE_NAMES.get(queue_id, game_mode)


async def analyze_player_by_puuid(
    puuid: str,
    riot_id_name: str = "",
    riot_id_tag: str = "",
    champion_id: int | None = None,
    position: Position = Position.UNKNOWN,
) -> SmurfAnalysisResponse:
    """Analyze a single player for smurf indicators.

    Args:
        puuid: Player PUUID
        riot_id_name: Optional Riot ID game name (from live game)
        riot_id_tag: Optional Riot ID tag (from live game)
        champion_id: Optional champion ID (from live game)
        position: Optional inferred position (from live game)

    Returns:
        SmurfAnalysisResponse with analysis results
    """
    # Get account info
    try:
        summoner = await riot_api.get_summoner_by_puuid(puuid)
    except SummonerNotFound:
        raise HTTPException(status_code=404, detail="Summoner not found")

    # Get ranked data using PUUID
    solo_tier = None
    solo_rank = None
    solo_wins = None
    solo_losses = None

    ranked_entries = await riot_api.get_ranked_entries(puuid)

    # Extract solo queue data
    for entry in ranked_entries:
        if entry.queue_type == "RANKED_SOLO_5x5":
            solo_tier = entry.tier
            solo_rank = entry.rank
            solo_wins = entry.wins
            solo_losses = entry.losses
            break

    # Fetch match history (limited to 5 to respect rate limits)
    matches = await match_service.get_recent_matches(puuid, count=5, queue_id=420)

    # Extract and aggregate stats
    player_stats = match_service.extract_player_stats(matches, puuid)
    aggregate_stats = match_service.calculate_aggregate_stats(player_stats)

    # Run smurf detection
    result = smurf_detector.analyze(
        aggregate_stats=aggregate_stats,
        summoner_level=summoner.summoner_level,
        tier=solo_tier,
        rank=solo_rank,
        ranked_wins=solo_wins,
        ranked_losses=solo_losses,
    )

    return SmurfAnalysisResponse(
        puuid=puuid,
        riot_id_name=riot_id_name,
        riot_id_tag=riot_id_tag,
        summoner_level=summoner.summoner_level,
        champion_id=champion_id,
        position=position,
        total_score=result.total_score,
        classification=SmurfClassification(result.classification.value),
        confidence=result.confidence,
        indicator_scores=IndicatorScores(
            winrate=result.indicator_scores.winrate,
            account_age=result.indicator_scores.account_age,
            champion_pool=result.indicator_scores.champion_pool,
            cs_per_min=result.indicator_scores.cs_per_min,
            kda=result.indicator_scores.kda,
            game_frequency=result.indicator_scores.game_frequency,
        ),
        raw_metrics=RawMetrics(
            winrate=aggregate_stats.get("winrate"),
            avg_cs_per_min=aggregate_stats.get("avg_cs_per_min"),
            avg_kda=aggregate_stats.get("avg_kda"),
            unique_champions=aggregate_stats.get("unique_champions"),
            games_per_day=aggregate_stats.get("games_per_day"),
            games_analyzed=aggregate_stats.get("games_analyzed", 0),
        ),
        analyzed_at=datetime.utcnow(),
    )


@router.post("/player", response_model=SmurfAnalysisResponse)
async def analyze_player(puuid: str) -> SmurfAnalysisResponse:
    """Analyze a single player for smurf indicators.

    Args:
        puuid: Player PUUID (passed as query parameter)

    Returns:
        Complete smurf analysis results
    """
    return await analyze_player_by_puuid(puuid)


@router.post("/match", response_model=MatchAnalysisResponse)
async def analyze_match(puuid: str) -> MatchAnalysisResponse:
    """Analyze all players in a live match.

    Args:
        puuid: PUUID of player to find match for

    Returns:
        Analysis results for all 10 players in the match
    """
    # Get live game
    try:
        live_game = await riot_api.get_live_game(puuid)
    except SummonerNotFound:
        raise HTTPException(
            status_code=404,
            detail="Player is not currently in a game",
        )

    # Build participant info map
    participant_info = {}
    blue_team_participants = []
    red_team_participants = []
    hidden_players_data = []  # Players with streamer mode (no puuid)

    for participant in live_game.participants:
        # Handle participants without a puuid (bots or streamer mode)
        if not participant.puuid:
            hidden_players_data.append({
                "champion_id": participant.champion_id,
                "team_id": participant.team_id,
                "spell1_id": participant.spell1_id,
                "spell2_id": participant.spell2_id,
            })
            continue

        # Parse Riot ID from the riotId field (format: "Name#Tag")
        riot_id_name = ""
        riot_id_tag = ""
        if participant.riot_id_name and "#" in participant.riot_id_name:
            parts = participant.riot_id_name.split("#", 1)
            riot_id_name = parts[0]
            riot_id_tag = parts[1] if len(parts) > 1 else ""
        elif participant.summoner_name:
            riot_id_name = participant.summoner_name

        p_data = {
            "puuid": participant.puuid,
            "riot_id_name": riot_id_name,
            "riot_id_tag": riot_id_tag,
            "champion_id": participant.champion_id,
            "spell1_id": participant.spell1_id,
            "spell2_id": participant.spell2_id,
        }

        participant_info[participant.puuid] = p_data

        if participant.team_id == 100:
            blue_team_participants.append(p_data)
        else:
            red_team_participants.append(p_data)

    # Infer positions for each team
    blue_positions = infer_team_positions(blue_team_participants)
    red_positions = infer_team_positions(red_team_participants)
    all_positions = {**blue_positions, **red_positions}

    blue_team_puuids = [p["puuid"] for p in blue_team_participants]
    red_team_puuids = [p["puuid"] for p in red_team_participants]

    # Analyze all players concurrently
    async def safe_analyze(p: str) -> SmurfAnalysisResponse | None:
        try:
            info = participant_info.get(p, {})
            return await analyze_player_by_puuid(
                p,
                riot_id_name=info.get("riot_id_name", ""),
                riot_id_tag=info.get("riot_id_tag", ""),
                champion_id=info.get("champion_id"),
                position=all_positions.get(p, Position.UNKNOWN),
            )
        except Exception as e:
            logger.warning(f"Failed to analyze player {p}: {e}")
            return None

    # Run all analyses concurrently
    all_puuids = blue_team_puuids + red_team_puuids
    results = await asyncio.gather(*[safe_analyze(p) for p in all_puuids])

    # Split results back into teams
    blue_results = []
    red_results = []

    for i, result in enumerate(results):
        if result is None:
            continue
        if i < len(blue_team_puuids):
            blue_results.append(result)
        else:
            red_results.append(result)

    # Build hidden player objects
    hidden_players = []

    # First, handle any participants with null puuid (rare, but possible)
    blue_assigned = {all_positions.get(p, Position.UNKNOWN) for p in blue_team_puuids}
    red_assigned = {all_positions.get(p, Position.UNKNOWN) for p in red_team_puuids}

    for hp_data in hidden_players_data:
        team_id = hp_data["team_id"]
        assigned = blue_assigned if team_id == 100 else red_assigned

        # Infer position for this hidden player
        pos = infer_position(
            hp_data["champion_id"],
            hp_data["spell1_id"],
            hp_data["spell2_id"],
        )

        # If position already taken, try to find an unassigned one
        if pos in assigned:
            all_pos = [Position.TOP, Position.JUNGLE, Position.MID, Position.BOT, Position.SUPPORT]
            available = [p for p in all_pos if p not in assigned]
            pos = available[0] if available else Position.UNKNOWN

        assigned.add(pos)

        hidden_players.append(HiddenPlayer(
            champion_id=hp_data["champion_id"],
            position=pos,
            team_id=team_id,
        ))

    # Detect completely hidden players (streamer mode excludes them from API entirely)
    # Standard 5v5 should have 5 players per team
    blue_visible = len(blue_team_participants) + len([h for h in hidden_players_data if h["team_id"] == 100])
    red_visible = len(red_team_participants) + len([h for h in hidden_players_data if h["team_id"] == 200])

    blue_hidden_count = max(0, 5 - blue_visible)
    red_hidden_count = max(0, 5 - red_visible)

    # Add placeholder hidden players for completely hidden streamer mode players
    for _ in range(blue_hidden_count):
        hidden_players.append(HiddenPlayer(
            champion_id=None,  # Unknown - API doesn't tell us
            position=Position.UNKNOWN,
            team_id=100,
        ))

    for _ in range(red_hidden_count):
        hidden_players.append(HiddenPlayer(
            champion_id=None,  # Unknown - API doesn't tell us
            position=Position.UNKNOWN,
            team_id=200,
        ))

    return MatchAnalysisResponse(
        game_id=live_game.game_id,
        game_mode=get_queue_name(live_game.game_queue_config_id, live_game.game_mode),
        blue_team=blue_results,
        red_team=red_results,
        hidden_players=hidden_players,
    )
