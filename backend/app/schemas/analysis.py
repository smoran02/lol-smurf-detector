"""Pydantic schemas for smurf analysis."""

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class SmurfClassification(str, Enum):
    """Smurf detection classification levels."""

    LIKELY_SMURF = "LIKELY_SMURF"
    POSSIBLE_SMURF = "POSSIBLE_SMURF"
    UNLIKELY = "UNLIKELY"
    UNKNOWN = "UNKNOWN"


class Position(str, Enum):
    """Player position in game."""

    TOP = "TOP"
    JUNGLE = "JUNGLE"
    MID = "MID"
    BOT = "BOT"
    SUPPORT = "SUPPORT"
    UNKNOWN = "UNKNOWN"


class IndicatorScores(BaseModel):
    """Individual indicator scores (0-100)."""

    winrate: float | None = None
    level_performance: float | None = None
    champion_pool: float | None = None
    cs_per_min: float | None = None
    kda: float | None = None
    game_frequency: float | None = None
    account_age_ratio: float | None = None


class RawMetrics(BaseModel):
    """Raw metrics used for scoring."""

    winrate: float | None = None
    avg_cs_per_min: float | None = None
    avg_kda: float | None = None
    unique_champions: int | None = None
    games_per_day: float | None = None
    games_analyzed: int


class SmurfAnalysisResponse(BaseModel):
    """Smurf analysis result for a player."""

    puuid: str
    riot_id_name: str
    riot_id_tag: str
    summoner_level: int
    champion_id: int | None = None  # Champion being played in live game
    position: Position = Position.UNKNOWN  # Inferred position in game

    # Overall result
    total_score: float = Field(ge=0, le=100)
    classification: SmurfClassification
    confidence: str  # "high", "medium", "low"

    # Detailed breakdown
    indicator_scores: IndicatorScores
    raw_metrics: RawMetrics

    # Timestamps
    analyzed_at: datetime

    class Config:
        from_attributes = True


class MatchAnalysisRequest(BaseModel):
    """Request to analyze a match."""

    puuid: str


class HiddenPlayer(BaseModel):
    """Player with privacy settings enabled (streamer mode)."""

    champion_id: int
    position: Position = Position.UNKNOWN
    team_id: int  # 100 for blue, 200 for red
    is_hidden: bool = True  # Always true, used to distinguish from analyzed players


class MatchAnalysisResponse(BaseModel):
    """Analysis results for all players in a match."""

    game_id: int
    game_mode: str
    blue_team: list[SmurfAnalysisResponse]
    red_team: list[SmurfAnalysisResponse]
    hidden_players: list[HiddenPlayer] = []  # Players with streamer mode enabled
