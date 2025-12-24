"""Match history fetching and processing service."""

import logging
from datetime import datetime

from app.schemas.match import MatchParticipant, MatchResponse
from app.services.riot_api import riot_api

logger = logging.getLogger(__name__)


class MatchService:
    """Service for fetching and processing match history data."""

    async def get_recent_matches(
        self,
        puuid: str,
        count: int = 20,
        queue_id: int | None = 420,  # Default to ranked solo
    ) -> list[MatchResponse]:
        """Fetch recent matches for a player.

        Args:
            puuid: Player PUUID
            count: Number of matches to fetch (max 100)
            queue_id: Queue filter (420=ranked solo, 440=flex, None=all)

        Returns:
            List of full match data
        """
        try:
            match_ids = await riot_api.get_match_ids(
                puuid=puuid,
                count=count,
                queue=queue_id,
            )
        except Exception as e:
            logger.warning(f"Failed to fetch match IDs for {puuid}: {e}")
            return []

        matches = []
        for match_id in match_ids:
            try:
                match = await riot_api.get_match(match_id)
                matches.append(match)
            except Exception as e:
                logger.warning(f"Failed to fetch match {match_id}: {e}")
                continue

        return matches

    def extract_player_stats(
        self,
        matches: list[MatchResponse],
        puuid: str,
    ) -> list[dict]:
        """Extract stats for a specific player from matches.

        Args:
            matches: List of match data
            puuid: Player PUUID to extract stats for

        Returns:
            List of player stats dicts with calculated metrics
        """
        stats = []

        for match in matches:
            # Find player in participants
            participant = None
            for p in match.info.participants:
                if p.puuid == puuid:
                    participant = p
                    break

            if not participant:
                continue

            # Calculate metrics
            game_duration_mins = match.info.game_duration / 60
            total_cs = participant.total_minions_killed + participant.neutral_minions_killed
            cs_per_min = total_cs / game_duration_mins if game_duration_mins > 0 else 0

            deaths = max(participant.deaths, 1)  # Avoid division by zero
            kda = (participant.kills + participant.assists) / deaths

            gold_per_min = participant.gold_earned / game_duration_mins if game_duration_mins > 0 else 0

            stats.append({
                "match_id": match.metadata.get("matchId", ""),
                "game_duration_seconds": match.info.game_duration,
                "game_creation": match.info.game_creation,
                "queue_id": match.info.queue_id,
                "champion_id": participant.champion_id,
                "champion_name": participant.champion_name,
                "kills": participant.kills,
                "deaths": participant.deaths,
                "assists": participant.assists,
                "total_cs": total_cs,
                "gold_earned": participant.gold_earned,
                "total_damage": participant.total_damage_dealt_to_champions,
                "vision_score": participant.vision_score,
                "win": 1 if participant.win else 0,
                "kda": round(kda, 2),
                "cs_per_min": round(cs_per_min, 2),
                "gold_per_min": round(gold_per_min, 2),
            })

        return stats

    def calculate_aggregate_stats(self, player_stats: list[dict]) -> dict:
        """Calculate aggregate statistics from match history.

        Args:
            player_stats: List of per-match stats

        Returns:
            Aggregated statistics dict
        """
        if not player_stats:
            return {
                "games_analyzed": 0,
                "winrate": None,
                "avg_kda": None,
                "avg_cs_per_min": None,
                "avg_gold_per_min": None,
                "unique_champions": 0,
                "total_kills": 0,
                "total_deaths": 0,
                "total_assists": 0,
            }

        games = len(player_stats)
        wins = sum(s["win"] for s in player_stats)

        unique_champs = len(set(s["champion_id"] for s in player_stats))

        total_kills = sum(s["kills"] for s in player_stats)
        total_deaths = sum(s["deaths"] for s in player_stats)
        total_assists = sum(s["assists"] for s in player_stats)

        avg_kda = sum(s["kda"] for s in player_stats) / games
        avg_cs = sum(s["cs_per_min"] for s in player_stats) / games
        avg_gold = sum(s["gold_per_min"] for s in player_stats) / games

        # Calculate games per day
        if len(player_stats) >= 2:
            timestamps = [s["game_creation"] for s in player_stats]
            oldest = min(timestamps)
            newest = max(timestamps)
            days_span = max((newest - oldest) / (1000 * 60 * 60 * 24), 1)
            games_per_day = games / days_span
        else:
            games_per_day = 0

        return {
            "games_analyzed": games,
            "winrate": round(wins / games * 100, 1),
            "avg_kda": round(avg_kda, 2),
            "avg_cs_per_min": round(avg_cs, 2),
            "avg_gold_per_min": round(avg_gold, 2),
            "unique_champions": unique_champs,
            "total_kills": total_kills,
            "total_deaths": total_deaths,
            "total_assists": total_assists,
            "games_per_day": round(games_per_day, 2),
        }


# Global service instance
match_service = MatchService()
